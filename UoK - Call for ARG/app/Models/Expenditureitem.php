<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Expenditureitem extends Model
{
    use HasFactory;
    protected $table = 'expenditures';

    // Use UUIDs instead of auto-incrementing IDs
    public $incrementing = false;
    protected $keyType = 'string';
    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'expenditureid';

    // Boot method to auto-generate UUIDs
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
