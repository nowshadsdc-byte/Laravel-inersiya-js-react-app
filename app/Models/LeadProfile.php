<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadProfile extends Model
{
    protected $fillable = ['lead_id', 'occupation', 'company', 'interest'];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
