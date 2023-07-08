import { mat4 } from "gl-matrix";

export class Crosshair{
    constructor(){
        const spriteW = 375.0;
        const spriteH = 267.0;

        this.initialX =(0)/spriteW;
        this.initialY = (spriteH-31)/spriteH;

        this.texW = 31.0/spriteW;
        this.texH = 31.0/spriteH;
        this.texSize = [this.texW, this.texH];

        this.position = [0, 240, 0];
        this.velocity = [5, 0];

        this.modelMatrix = new Float32Array(16);
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.scale(this.modelMatrix, this.modelMatrix, [25, 25, 1]);
    }

    getCurrentTex(){
        return [this.initialX, this.initialY];
    }

    update(delta_time){

        this.position[0]+=this.velocity[0];
        this.position[1]+=this.velocity[1];

        if((this.position[0]>640 && this.velocity[0]>0 ) || (this.position[0]<0 && this.velocity[0]<0 ) )
            this.velocity[0] *= -1;

        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.scale(this.modelMatrix, this.modelMatrix, [25, 25, 1]);

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