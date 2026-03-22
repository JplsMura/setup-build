<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Component extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'type',
        'name',
        'brand',
        'specs',
    ];

    protected $casts = [
        'specs' => 'array',
    ];

    public function setups(): BelongsToMany
    {
        return $this->belongsToMany(Setup::class)->withTimestamps();
    }
}
