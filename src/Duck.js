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

        this.position = [0, 240, 0];
        this.velocity = [0, 0];

        this.modelMatrix = new Float32Array(16);
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.scale(this.modelMatrix, this.modelMatrix, [40, 40, 1]);

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

        this.position[0]+=this.velocity[0];
        this.position[1]+=this.velocity[1];

        if((this.position[0]>640 && this.velocity[0]>0 ) || (this.position[0]<0 && this.velocity[0]<0 ) )
            this.velocity[0] *= -1;


        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.scale(this.modelMatrix, this.modelMatrix, [40, 40, 1]);

    }

    update(delta_time, inputMap){
        if(this.currentTimer >= this.frameTime){
            this.currentCycle = (this.currentCycle+1)%4;
            this.currentTimer = 0.0;
        }else{
            this.currentTimer += delta_time;
        }

        if(inputMap.up){
            this.currentState = 1;
            this.move(0, 5);
        }else{
            this.currentState = 0;
        }

        if(inputMap.down)
            this.move(0, -5);

        if(inputMap.left){
            this.velocity[0] = -1;
            this.move(-5, 0);
        }
        
        if(inputMap.right){
            this.velocity[0] = 1;
            this.move(5, 0);
        }

        // if((this.position[0]>640 && this.velocity[0]>0 ) || (this.position[0]<0 && this.velocity[0]<0 ) )
        //     this.velocity[0] *= -1;


        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
        mat4.scale(this.modelMatrix, this.modelMatrix, [40, 40, 1]);

    }

    move(x, y){
        this.position[0] += x;
        this.position[1] += y;
    }

    sendUniforms(gl, programInfo){
        gl.uniform2fv(programInfo.uniformLocations.texOffset, this.getCurrentTex());
        gl.uniform2fv(programInfo.uniformLocations.texSize, this.texSize);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, gl.FALSE, this.modelMatrix);
        gl.uniform1f(programInfo.uniformLocations.xflip, this.velocity[0]>0?1.0:-1.0); 
    }
}