<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Component;

class ComponentSeeder extends Seeder
{
    public function run(): void
    {
        $components = [
            [
                'type' => 'cpu',
                'name' => 'Ryzen 7 7800X3D',
                'brand' => 'AMD',
                'specs' => ['socket' => 'AM5', 'cores' => 8, 'threads' => 16, 'tdp' => '120W']
            ],
            [
                'type' => 'gpu',
                'name' => 'GeForce RTX 5070',
                'brand' => 'NVIDIA',
                'specs' => ['vram' => '12GB GDDR7', 'cuda_cores' => 7680, 'tdp' => '250W']
            ],
            [
                'type' => 'motherboard',
                'name' => 'ROG STRIX B650E-F GAMING WIFI',
                'brand' => 'ASUS',
                'specs' => ['socket' => 'AM5', 'form_factor' => 'ATX', 'ddr_type' => 'DDR5']
            ],
            [
                'type' => 'ram',
                'name' => 'Trident Z5 Neo RGB 32GB (2 x 16GB)',
                'brand' => 'G.Skill',
                'specs' => ['type' => 'DDR5', 'speed' => '6000MHz', 'cas_latency' => 'CL30']
            ],
            [
                'type' => 'psu',
                'name' => 'RM850x',
                'brand' => 'Corsair',
                'specs' => ['wattage' => '850W', 'efficiency' => '80+ Gold', 'modular' => 'Fully']
            ]
        ];

        foreach ($components as $component) {
            Component::create($component);
        }
    }
}
