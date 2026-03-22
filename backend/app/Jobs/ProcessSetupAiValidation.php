<?php

namespace App\Jobs;

use App\Models\Setup;
use App\Actions\ValidateHardwareAction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessSetupAiValidation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $setup;

    public function __construct(Setup $setup)
    {
        $this->setup = $setup;
    }

    public function handle(ValidateHardwareAction $validator): void
    {
        $validator->execute($this->setup);
    }
}
