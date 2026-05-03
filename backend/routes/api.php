<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\ComponentController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Catálogo Aberto
    Route::get('/components', [ComponentController::class, 'index']);

    // Rotas de Usuários Logados (para Setups) a serem criadas na etapa 3:
    Route::post('/setups', [SetupController::class, 'store']);
    // Route::post('/setups/{setup}/like', [LikeController::class, 'store']);
    // Route::post('/setups/{setup}/comment', [CommentController::class, 'store']);
});

// Rotas de Visitantes:
Route::get('/setups', [SetupController::class, 'index']);
Route::get('/setups/{setup}', [SetupController::class, 'show']);
