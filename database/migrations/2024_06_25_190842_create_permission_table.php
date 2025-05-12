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
        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('pid')->primary(); 
            $table->string('menuname'); // Menu name column
            $table->string('shortname')->unique(); // Role name column
            $table->string('path'); // Role URL column
            $table->integer('priorityno'); //order of menu
            $table->integer('permissionlevel'); // permission level column
            $table->integer('targetrole');
            $table->boolean('issuperadminright')->default(false); // Admin or non admin 
            $table->text('description')->nullable(); // Description column, nullable
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
        Schema::dropIfExists('permissions');
    }
};
