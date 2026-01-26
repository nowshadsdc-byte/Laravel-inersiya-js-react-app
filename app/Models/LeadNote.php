<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadNote extends Model
{
    protected $fillable = [
        'lead_id',
        'note',
        'user_id'
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
