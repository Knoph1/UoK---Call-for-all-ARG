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
        Schema::create('supervisionprogress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('researchidfk');
            $table->uuid('supervisorfk');
            $table->text('report');
            $table->text('remark');
            $table->foreign('researchidfk')->references('researchid')->on('researchprojects')->onDelete('restrict');
            $table->foreign('supervisorfk')->references('userid')->on('users')->onDelete('restrict');
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
        Schema::dropIfExists('supervisionprogress');
    }
};
