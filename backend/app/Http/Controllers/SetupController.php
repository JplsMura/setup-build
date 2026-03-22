<?php

namespace App\Http\Controllers;

use App\Actions\CreateSetupAction;
use App\Http\Requests\StoreSetupRequest;
use App\Jobs\ProcessSetupAiValidation;
use App\Models\Setup;

class SetupController extends Controller
{
    public function index()
    {
        return response()->json(Setup::with('user')->latest()->get());
    }

    public function show(Setup $setup)
    {
        return response()->json([
            'setup' => $setup->load(['user', 'components'])
        ]);
    }

    public function store(StoreSetupRequest $request, CreateSetupAction $createSetupAction)
    {
        $setup = $createSetupAction->execute($request->user(), $request->validated());

        ProcessSetupAiValidation::dispatch($setup);

        return response()->json([
            'message' => 'O Setup foi criado. A IA está analisando a performance da máquina agora usando background jobs.',
            'setup' => $setup->load('components')
        ], 201);
    }
}
