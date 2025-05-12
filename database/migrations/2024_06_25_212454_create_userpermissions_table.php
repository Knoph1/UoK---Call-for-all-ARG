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
        Schema::create('userpermissions', function (Blueprint $table) {
            $table->uuid('id')->primary(); 
            $table->string('useridfk');
            $table->string('permissionidfk');
            $table->foreign('useridfk')->references('userid')->on('users')->onDelete('restrict');
            $table->foreign('permissionidfk')->references('pid')->on('permissions')->onDelete('restrict');
            $table->timestamps(); // Created at and updated at columns
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('userpermissions');
    }
};
