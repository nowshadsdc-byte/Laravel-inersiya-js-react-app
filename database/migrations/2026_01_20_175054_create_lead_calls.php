<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lead_calls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->dateTime('called_at');
            $table->enum('result', [
                'answered',
                'no_answer',
                'busy',
                'missed',
                'unavailable',
                'not_reachable',

                'interested',
                'not_interested',
                'maybe_interested',

                'call_back_later',
                'follow_up_required',
                'meeting_scheduled',

                'qualified',
                'not_qualified',

                'proposal_sent',
                'negotiation',

                'converted',
                'won',
                'lost',

                'wrong_person',
                'invalid_number',
                'duplicate_lead',
                'rejected'
            ]);

            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_calls');
    }
};
