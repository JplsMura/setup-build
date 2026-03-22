<?php

namespace App\Actions;

use App\Models\Setup;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateSetupAction
{
    public function execute(User $user, array $data): Setup
    {
        return DB::transaction(function () use ($user, $data) {
            $setup = $user->setups()->create([
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'ai_status' => 'pending',
            ]);

            if (isset($data['components']) && is_array($data['components'])) {
                $setup->components()->attach($data['components']);
            }

            return $setup;
        });
    }
}
