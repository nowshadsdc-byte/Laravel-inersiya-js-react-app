<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadReminder extends Model
{
    protected $fillable = ['lead_id', 'reminder_date', 'reminder_time', 'reminder_type', 'reminder_message'];
}
