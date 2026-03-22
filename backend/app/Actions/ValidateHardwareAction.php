<?php

namespace App\Actions;

use App\Models\Setup;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ValidateHardwareAction
{
    public function execute(Setup $setup): void
    {
        // Garante que temos as relações
        $components = $setup->components()->get();
        if ($components->isEmpty()) return;

        $prompt = "Aja como um Senior Hardware Engineer de Computadores. Avalie o seguinte setup e retorne EXATAMENTE um JSON na estrutura definida abaixo, MANTENHA-SE ESTRITAMENTE AO JSON E NAO RESPONDA MAIS NADA NO CORPO DA RESPOSTA. Retorne um JSON limpo, decodificavel e sem blocos markdown.
Setup Title: {$setup->title}
Description: {$setup->description}
Components:\n";

        foreach ($components as $comp) {
            $prompt .= "- {$comp->type}: {$comp->brand} {$comp->name} | Specs: " . json_encode($comp->specs) . "\n";
        }

        $prompt .= '
Estrutura JSON esperada:
{
  "is_compatible": true/false (bool),
  "bottleneck_risk": "low" ou "medium" ou "high" (string),
  "warnings": ["Array de strings pontuando os riscos, se a placa de video couber no gabinete, gargalos e TDP das peças com a fonte (PSU)"],
  "verdict": "Resumo humano final"
}';

        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            Log::error("Gemini API Error: GEMINI_API_KEY stands empty.");
            $setup->update(['ai_status' => 'pending', 'ai_feedback' => ['error' => 'Chave de API do Gemini não configurada.']]);
            return;
        }

        try {
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]);

            if ($response->successful()) {
                $result = $response->json();
                $textRaw = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';
                
                // Tratar possivel encapsulamento (markdown do JSON) da IA
                $textRaw = str_replace(["```json\n", "```json", "```"], '', $textRaw);
                $jsonData = json_decode(trim($textRaw), true);

                if ($jsonData && isset($jsonData['is_compatible'])) {
                    $status = 'approved';
                    if (!$jsonData['is_compatible']) {
                        $status = 'incompatible';
                    } elseif ($jsonData['bottleneck_risk'] === 'high') {
                        $status = 'has_bottleneck';
                    }

                    $setup->update([
                        'ai_status' => $status,
                        'ai_feedback' => $jsonData
                    ]);
                } else {
                    $setup->update(['ai_status' => 'pending', 'ai_feedback' => ['error' => 'Invalid JSON from AI', 'raw' => $textRaw]]);
                }
            } else {
                Log::error("Gemini API Error: " . $response->body());
                $setup->update(['ai_status' => 'pending', 'ai_feedback' => ['error' => 'Erro HTTP da API.']]);
            }
        } catch (\Exception $e) {
            Log::error("Gemini Request Exception: " . $e->getMessage());
            $setup->update(['ai_status' => 'pending', 'ai_feedback' => ['error' => $e->getMessage()]]);
        }
    }
}
