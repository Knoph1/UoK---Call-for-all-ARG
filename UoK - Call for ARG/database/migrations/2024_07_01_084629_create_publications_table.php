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
        Schema::create('publications', function (Blueprint $table) {
            $table->string('publicationid')->primary();
            $table->unsignedBigInteger('proposalidfk'); 
            $table->string('authors');
            $table->string('year'); 
            $table->string('title');
            $table->string('researcharea');
            $table->string('publisher');  
            $table->string('volume');
            $table->integer('pages');            
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
        Schema::dropIfExists('publications');
    }
};
