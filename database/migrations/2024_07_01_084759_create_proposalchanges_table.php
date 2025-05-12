<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proposalchanges', function (Blueprint $table) {
            $table->id('changeid');
            $table->unsignedBigInteger('proposalidfk'); 
            $table->text('triggerissue'); 
            $table->text('suggestedchange'); 
            $table->string('suggestedbyfk'); 
            $table->string('status'); 
            $table->foreign('proposalidfk')->references('proposalid')->on('proposals')->onDelete('restrict');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proposalchanges');
    }
};
