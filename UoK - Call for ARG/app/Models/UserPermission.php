<?php
// app/Models/UserPermission.php
// app/Models/UserPermission.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class UserPermission extends Model
{
    use HasFactory;

    // Table name (optional, if not following Laravel naming conventions)
    protected $table = 'userpermissions';

    // Define the fillable attributes
    protected $fillable = [
        'useridfk',
        'permissionidfk',
    ];

    // Use UUIDs instead of auto-incrementing IDs
    public $incrementing = false;
    protected $keyType = 'string';

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

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'userid');
    }

    // Define the relationship with the Permission model
    public function permission()
    {
        return $this->belongsTo(Permission::class, 'permissionid');
    }
}
