<?php

namespace Database\Seeders;

use App\Models\Component;
use Illuminate\Database\Seeder;

class CoolerSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Um Watercooler de Alta Performance
        Component::create([
            'type' => 'cooler',
            'brand' => 'Corsair',
            'name' => 'iCUE H150i Elite Capellix XT (360mm)',
            'specs' => [
                'type' => 'Watercooler AIO',
                'size' => '360mm',
                'fans' => 3,
                'socket_support' => ['AM5', 'LGA1700']
            ]
        ]);

        // 2. Um Air Cooler Robusto e Custo-Benefício
        Component::create([
            'type' => 'cooler',
            'brand' => 'DeepCool',
            'name' => 'AK620',
            'specs' => [
                'type' => 'Air Cooler Dual-Tower',
                'fans' => 2,
                'tdp_support' => '260W',
                'socket_support' => ['AM5', 'LGA1700']
            ]
        ]);

        // 3. Um Watercooler monstro para o i9 / Ryzen 9
        Component::create([
            'type' => 'cooler',
            'brand' => 'Arctic',
            'name' => 'Liquid Freezer III 420',
            'specs' => [
                'type' => 'Watercooler AIO',
                'size' => '420mm',
                'fans' => 3,
                'socket_support' => ['AM5', 'LGA1700']
            ]
        ]);
    }
}