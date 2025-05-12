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
        Schema::create('grants', function (Blueprint $table) {
            $table->unsignedInteger('grantid')->autoIncrement();  
            $table->string('title');
            $table->unsignedBigInteger('finyearfk'); 
            $table->string('status'); 
            $table->timestamps();
            $table->foreign('finyearfk')->references('id')->on('finyears')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grants');
    }
};
