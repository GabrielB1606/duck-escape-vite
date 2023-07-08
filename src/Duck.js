import { mat4 } from "gl-matrix";

export class Duck{
    constructor(color){
        const spriteW = 375.0;
        const spriteH = 267.0;

        const initialX =(color*10 + color*120.0)/spriteW;
        const initialY = 112.0/spriteH;

        this.texW = 40.0/spriteW;
        this.texH = 40.0/spriteH;
        this.texSize = [this.texW, this.texH];

        this.states = [];
        
        this.currentState = 0;
        this.currentCycle = 0;

        this.currentTimer = 0.0;
        this.frameTime = 125.0;

        this.modelMatrix = new Float32Array(16);
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.125, 0.125, 1]);

        // v_texCoord = vec2((a_texCoord.x/375.0)*40.0, (112.0/267.0)+(a_texCoord.y/267.0)*40.0);

        for (let i = 0; i < 4; i++) {
            this.states.push([]);
            for (let j = 0; j < 3; j++) {
                this.states[i].push( [initialX + j*this.texW, initialY + i*this.texH] );
            }
            this.states[i].push( [initialX + this.texW, initialY + i*this.texH] );
        }

    }

    getCurrentTex(){
        return this.states[this.currentState][this.currentCycle];
    }

    update(delta_time){
        if(this.currentTimer >= this.frameTime){
            this.currentCycle = (this.currentCycle+1)%4;
            this.currentTimer = 0.0;
        }else{
            this.currentTimer += delta_time;
        }

    }

    sendUniforms(gl, u_offset_loc, u_size_loc, u_model_loc){
        gl.uniform2fv(u_offset_loc, this.getCurrentTex());
        gl.uniform2fv(u_size_loc, this.texSize);
        gl.uniformMatrix4fv(u_model_loc, gl.FALSE, this.modelMatrix);
    }
}