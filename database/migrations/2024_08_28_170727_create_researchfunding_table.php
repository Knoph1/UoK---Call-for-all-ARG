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
        Schema::create('researchfundings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('researchidfk');
            $table->uuid('createdby');
            $table->double('amount');
            $table->foreign('researchidfk')->references('researchid')->on('researchprojects')->onDelete('restrict');
            $table->foreign('createdby')->references('userid')->on('users')->onDelete('restrict');
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
        Schema::dropIfExists('researchfundings');
    }
};
