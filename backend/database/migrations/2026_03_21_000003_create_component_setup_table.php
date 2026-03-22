<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('component_setup', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('component_id')->constrained('components')->cascadeOnDelete();
            $table->foreignUuid('setup_id')->constrained('setups')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('component_setup');
    }
};
