<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up(): void
    {
        Schema::create('components', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->enum('type', [
                'cpu', 'gpu', 'motherboard', 'ram',
                'psu', 'case', 'storage', 'cooler'
            ]);

            $table->string('name');
            $table->string('brand');
            $table->jsonb('specs')->nullable();
            $table->timestamps();
            $table->unique(['name', 'brand']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('components');
    }
};
