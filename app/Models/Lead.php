<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'status_id',
        'source_id',
        'assigned_to',
        'whatsapp_number',
        'address',
        'town',

    ];
    public function status()
    {
        return $this->belongsTo(LeadStatus::class);
    }

    public function source()
    {
        return $this->belongsTo(LeadSource::class);
    }

    public function notes()
    {
        return $this->hasMany(LeadNote::class);
    }

    public function calls()
    {
        return $this->hasMany(LeadCall::class);
    }

    public function reminders()
    {
        return $this->hasMany(LeadReminder::class);
    }

    public function profile()
    {
        return $this->hasOne(LeadProfile::class);
    }
}
