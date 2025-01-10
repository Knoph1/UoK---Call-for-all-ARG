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
        Schema::create('researchprogress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('researchidfk');
            $table->uuid('reportedbyfk');
            $table->text('report');
            $table->foreign('researchidfk')->references('researchid')->on('researchprojects')->onDelete('restrict');
            $table->foreign('reportedbyfk')->references('userid')->on('users')->onDelete('restrict');
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
        Schema::dropIfExists('researchprogress');
    }
};
