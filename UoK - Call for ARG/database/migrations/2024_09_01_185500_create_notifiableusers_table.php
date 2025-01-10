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
        Schema::create('notifiableusers', function (Blueprint $table) {
            $table->id();
            $table->uuid('notificationfk');
            $table->uuid('useridfk');            
            $table->foreign('notificationfk')->references('typeuuid')->on('notificationtypes')->onDelete('restrict');             
            $table->foreign('useridfk')->references('userid')->on('users')->onDelete('restrict');             
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
        Schema::dropIfExists('notifiableusers');
    }
};
