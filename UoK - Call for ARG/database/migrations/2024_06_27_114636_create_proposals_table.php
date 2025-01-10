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
        Schema::create('proposals', function (Blueprint $table) {
            //basic details
            $table->id('proposalid'); //for computer identification
            $table->string('proposalcode')->unique();//for human identification
            $table->unsignedInteger('grantnofk');
            $table->uuid('departmentidfk');            
            $table->uuid('useridfk');
            $table->string('pfnofk');
            $table->integer('themefk');
            $table->boolean('submittedstatus')->default(false);  
            $table->boolean('receivedstatus')->default(false);  
            $table->boolean('caneditstatus')->default(true);  
            $table->string('approvalstatus')->default('Pending');
            $table->string('highqualification');
            $table->string('officephone');
            $table->string('cellphone');
            $table->string('faxnumber'); 
            $table->foreign('grantnofk')->references('grantid')->on('grants')->onDelete('restrict');
            $table->foreign('useridfk')->references('userid')->on('users')->onDelete('restrict');
            $table->foreign('pfnofk')->references('pfno')->on('users')->onDelete('restrict');
            $table->foreign('departmentidfk')->references('depid')->on('departments')->onDelete('restrict');            
            $table->foreign('themefk')->references('themeid')->on('researchthemes')->onDelete('restrict');

            //research details
            $table->string('researchtitle')->nullable();
            $table->date('commencingdate')->nullable();
            $table->date('terminationdate')->nullable(); 
            $table->text('objectives')->nullable();
            $table->text('hypothesis')->nullable();
            $table->text('significance')->nullable();
            $table->text('ethicals')->nullable();
            $table->text('expoutput')->nullable();
            $table->text('socio_impact')->nullable();
            $table->text('res_findings')->nullable();            
            $table->text('comment')->nullable();
            $table->uuid('approvedrejectedbywhofk')->nullable();            
            $table->foreign('approvedrejectedbywhofk')->references('userid')->on('users')->onDelete('restrict');

            //others
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
        Schema::dropIfExists('proposals');
    }
};
