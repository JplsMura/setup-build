<?php

namespace App\Actions;

use App\Models\Setup;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ValidateHardwareAction
{
    public function execute(Setup $setup): void
    {
        $components = $setup->components()->get();
        if ($components->isEmpty())
            return;

        $prompt = "Aja como um Senior Hardware Engineer de Computadores. Avalie o seguinte setup:\n";
        $prompt .= "Setup Title: {$setup->title}\n";
        $prompt .= "Description: {$setup->description}\n";
        $prompt .= "Components:\n";

        // Injeta as peças que o usuário escolheu no banco de dados
        foreach ($components as $comp) {
            $prompt .= "- {$comp->type}: {$comp->brand} {$comp->name} | Specs: " . json_encode($comp->specs) . "\n";
        }

        // A trava de segurança que você criou para forçar o formato
        $prompt .= 'ESTRITA OBRIGAÇÃO: Retorne APENAS um objeto JSON válido, sem NENHUM texto antes ou depois. Não inclua blocos markdown como "```json". A estrutura deve ser EXATAMENTE esta abaixo, sem adicionar chaves extras:
            {
            "is_compatible": true,
            "bottleneck_risk": "low",
            "warnings": ["Aviso sobre fonte", "Aviso sobre tamanho da placa"],
            "verdict": "Resumo humano de 2 frases sobre a máquina."
            }';

        $apiKey = env('GEMINI_API_KEY');

        // AJUSTE 1: Se a chave falhar, mude o status para 'incompatible' para destravar o Front[cite: 4, 23]
        if (!$apiKey) {
            Log::error("Gemini API Error: GEMINI_API_KEY stands empty.");
            $setup->update([
                'ai_status' => 'incompatible',
                'ai_feedback' => ['error' => 'Chave de API do Gemini não configurada no servidor.']
            ]);
            return;
        }

        try {
            // AJUSTE 2: URL v1 com o modelo base (sem o sufixo -latest que às vezes buga em certas regiões)[cite: 20]
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(120)
                ->post("https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]);

            if ($response->successful()) {
                $result = $response->json();
                $textRaw = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
                $textRaw = str_replace(["```json\n", "```json", "```"], '', $textRaw);
                $jsonData = json_decode(trim($textRaw), true);

                if ($jsonData && isset($jsonData['is_compatible'])) {
                    $status = $jsonData['is_compatible'] ? 'approved' : 'incompatible';
                    if ($status === 'approved' && ($jsonData['bottleneck_risk'] ?? '') === 'high') {
                        $status = 'has_bottleneck';
                    }

                    $setup->update(['ai_status' => $status, 'ai_feedback' => $jsonData]);
                } else {
                    // Fallback para erro de parsing da IA[cite: 22]
                    $setup->update([
                        'ai_status' => 'incompatible',
                        'ai_feedback' => ['error' => 'A IA gerou uma resposta inválida.', 'details' => $textRaw]
                    ]);
                }
            } else {
                Log::error("Gemini API Error: " . $response->body());
                $setup->update([
                    'ai_status' => 'incompatible', // Evita o erro de SQL Check[cite: 22]
                    'ai_feedback' => ['error' => 'Erro na API do Google.', 'details' => $response->json()]
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Gemini Request Exception: " . $e->getMessage());
            $setup->update([
                'ai_status' => 'incompatible',
                'ai_feedback' => ['error' => 'Falha de conexão.', 'details' => $e->getMessage()]
            ]);
        }
    }
}
