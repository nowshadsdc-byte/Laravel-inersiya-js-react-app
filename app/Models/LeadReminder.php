<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadReminder extends Model
{
    protected $fillable = ['lead_id','user_id','remind_at','is_completed'];
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
