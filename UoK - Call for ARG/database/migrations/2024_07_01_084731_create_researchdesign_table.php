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
        Schema::create('researchdesigns', function (Blueprint $table) {
            $table->string('designid')->primary();
            $table->unsignedBigInteger('proposalidfk'); 
            $table->string('summary');
            $table->text('indicators'); 
            $table->string('verification');
            $table->text('assumptions');
            $table->string('goal');  
            $table->string('purpose');
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
        Schema::dropIfExists('researchdesigns');
    }
};
