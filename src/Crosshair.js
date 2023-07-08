import { mat4 } from "gl-matrix";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export class Crosshair{
    constructor(){

        this.speed = 4;

        const spriteW = 375.0;
        const spriteH = 267.0;

        this.initialX =(0)/spriteW;
        this.initialY = (spriteH-31)/spriteH;

        this.texW = 31.0/spriteW;
        this.texH = 31.0/spriteH;
        this.texSize = [this.texW, this.texH];

        this.position = [0, 240, 0];
        this.velocity = [5, 0];

        this.currentTimer = 0.0;
        this.frameTime = 250.0;

        this.currentFireTimer = 0.0;
        this.fireTimer = 500.0;

        this.modelMatrix = new Float32Array(16);
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.scale(this.modelMatrix, this.modelMatrix, [25, 25, 1]);
    }

    getCurrentTex(){
        return [this.initialX, this.initialY];
    }

    update(delta_time, target){

        if(this.currentTimer >= this.frameTime){
            // this.currentCycle = (this.currentCycle+1)%4;
            this.velocity = [ 
                clamp( target.position[0] - this.position[0], -this.speed, this.speed),
                clamp( target.position[1] - this.position[1], -this.speed, this.speed)
            ];

            this.currentTimer = 0.0;
        }else{
            this.currentTimer += delta_time;
        }

        if(this.currentFireTimer >= this.fireTimer){

            if( this.fire(target) )
                console.log("HIT");
            else
                console.log("MISS");

            this.currentFireTimer = 0.0;
        }else{
            this.currentFireTimer += delta_time;
        }

        this.position[0]+=this.velocity[0];
        this.position[1]+=this.velocity[1];

        if((this.position[0]>640 && this.velocity[0]>0 ) || (this.position[0]<0 && this.velocity[0]<0 ) )
            this.velocity[0] *= -1;

        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.scale(this.modelMatrix, this.modelMatrix, [25, 25, 1]);

    }

    fire(target){
        return (
            Math.abs( this.position[0] - target.position[0] ) < target.getSize()[0]
            &&
            Math.abs( this.position[1] - target.position[1] ) < target.getSize()[1]
        );
    }

    move(x, y){
        this.position[0] += x;
        this.position[1] += y;
    }

    sendUniforms(gl, programInfo){
        gl.uniform2fv(programInfo.uniformLocations.texOffset, this.getCurrentTex());
        gl.uniform2fv(programInfo.uniformLocations.texSize, this.texSize);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, gl.FALSE, this.modelMatrix);
        // gl.uniform1f(programInfo.uniformLocations.xflip, 1.0); 
    }
}