<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('researchprojects', function (Blueprint $table) {
            $table->id('researchid'); //for computer identification
            $table->string('researchnumber')->unique();//for human identification
            $table->unsignedBigInteger('proposalidfk')->unique();
            $table->string('projectstatus')->default('active'); //active,cancelled,completed
            $table->boolean('ispaused')->default(false);
            $table->string('supervisorfk')->nullable();
            $table->unsignedBigInteger('fundingfinyearfk');
            $table->foreign('fundingfinyearfk')->references('id')->on('finyears')->onDelete('restrict');
            $table->foreign('supervisorfk')->references('userid')->on('users')->onDelete('restrict');
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
        Schema::dropIfExists('researchprojects');
    }
};
