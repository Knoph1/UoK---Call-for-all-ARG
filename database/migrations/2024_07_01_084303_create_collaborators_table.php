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
        Schema::create('collaborators', function (Blueprint $table) {
            $table->string('collaboratorid')->primary();
            $table->unsignedBigInteger('proposalidfk');
            $table->string('collaboratorname');
            $table->string('position'); 
            $table->string('institution');
            $table->string('researcharea');
            $table->string('experience');  
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
        Schema::dropIfExists('collaborators');
    }
};
