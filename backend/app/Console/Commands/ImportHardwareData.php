<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Component;
use Illuminate\Support\Facades\DB;

class ImportHardwareData extends Command
{
    // Mudamos o nome do comando e o arquivo padrão esperado
    protected $signature = 'hardware:import {path? : O caminho absoluto para o arquivo CSV}';
    protected $description = 'Importa um dataset massivo em CSV (ex: Kaggle) para o banco de dados';

    public function handle()
    {
        $path = $this->argument('path') ?? storage_path('app/hardware.csv');

        if (!file_exists($path)) {
            $this->error("Arquivo não encontrado em: {$path}");
            $this->info("Dica: Baixe o CSV no Kaggle, renomeie para hardware.csv, coloque na pasta storage/app/ e rode novamente.");
            return Command::FAILURE;
        }

        $this->info("Iniciando a leitura do CSV...");

        $file = fopen($path, 'r');
        $header = fgetcsv($file); // Lê e pula a primeira linha (cabeçalhos como "Name", "Brand", etc)

        $insertData = [];
        $count = 0;

        DB::beginTransaction();

        try {
            while (($row = fgetcsv($file)) !== false) {
                // ⚠️ ATENÇÃO: Aqui você vai mapear as colunas do seu CSV.
                // Se no CSV a coluna 0 for o Nome e a coluna 1 for a Marca:
                $insertData[] = [
                    'id' => \Illuminate\Support\Str::uuid()->toString(),
                    'type' => strtolower($row[2] ?? 'cpu'), // Ex: Coluna 2 é o tipo
                    'name' => $row[0], // Ex: Coluna 0 é o nome (Ryzen 7)
                    'brand' => $row[1], // Ex: Coluna 1 é a marca (AMD)

                    // Tudo que for especificação técnica vai pro JSONB!
                    'specs' => json_encode([
                        'socket' => $row[3] ?? null,
                        'tdp' => $row[4] ?? null,
                        'core_clock' => $row[5] ?? null,
                    ]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $count++;

                // A cada 500 linhas, fazemos o Upsert no banco e limpamos a memória
                if ($count % 500 === 0) {
                    Component::upsert($insertData, ['name', 'brand'], ['specs', 'updated_at']);
                    $insertData = []; // Esvazia o array
                    $this->info("Processadas {$count} peças...");
                }
            }

            // Insere o restante que sobrou no final (ex: as últimas 300 peças)
            if (!empty($insertData)) {
                Component::upsert($insertData, ['name', 'brand'], ['specs', 'updated_at']);
            }

            DB::commit();
            fclose($file);

            $this->newLine();
            $this->info("✅ Importação concluída! Total de {$count} peças salvas no PostgreSQL.");
            return Command::SUCCESS;

        }
        catch (\Exception $e) {
            DB::rollBack();
            fclose($file);
            $this->error("❌ Erro fatal: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}