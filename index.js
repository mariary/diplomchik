const canvas = document.getElementById('canvas');
const count_x_input = document.getElementById('count_x');
const coef_D_input = document.getElementById('coef_D');
const coef_v_input = document.getElementById('coef_v');
const coef_t_input = document.getElementById('coef_t');
const num_x_input = document.getElementById('num_x');
const start_btn = document.getElementById('start_btn');
const draw_btn = document.getElementById('draw_btn');
const ctx = canvas.getContext('2d')

const ctxWidth = 800;
const ctxHeight = 500;

const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    canvas.width = ctxWidth;
    canvas.height = ctxHeight;
}
resize()
window.addEventListener("load", main_equations);

function main_equations() {
    let nx = 80;
    let nt = 85;
    let a = 0;
    let b = 30;
    let D = 0.005;
    let v = 0.5;
    let t0 = 0;
    let tf = 35;
    let dx = (b - a) / (nx - 1);
    let dt = (tf - t0) / (nt - 1);
    let x = [];
    let t = [];
    let anim_speed = 10;
    let concentration_dot = 10

    const xScale = ctxWidth / (b - a);
    const yScale = ctxHeight - 50;
    const s1 = dt / (dx);
    const s2 = dt / Math.pow(dx, 2);

    const UN = new Array(nt).fill(0).map(() => new Array(nx).fill(0));

    const add_event_input = (name_input, name) => name_input.value = name

    const init_vars = () => {
        add_event_input(coef_D_input, D);
        add_event_input(coef_t_input, anim_speed);
        add_event_input(coef_v_input, v);
        add_event_input(num_x_input, concentration_dot);
    }
    init_vars()

    const solve_equation = () => {
        for (let n = 0; n < nt; n++) {
            for (let i = 0; i < nx; i++) {
                UN[i][n] = 0
            }
        }
        UN[num_x_input.value][0] = 1
        for (let i = a; i <= b;
             i += dx
        ) {
            x.push(i)
        }
        for (let i = t0; i <= tf; i += dt) {
            t.push(i)
        }
        for (let n = 0; n < nt; n++) {
            for (let i = 1; i < nx; i++) {
                UN[i][n + 1] = UN[i][n] + coef_D_input.value * s2 * (UN[i + 1][n] - 2 * UN[i][n] + UN[i - 1][n]) - coef_v_input.value * s1 * (UN[i][n] - UN[i - 1][n]);
            }
        }
    }

    const draw_lines = (n) => {
        for (let i = 0; i < nx; i++) {
            if (i) {
                ctx.beginPath();
                ctx.moveTo(xScale * x[i - 1], yScale * UN[i - 1][n] + 10);
                ctx.lineTo((xScale * x[i]), yScale * UN[i][n] + 10);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }

    const draw_anim = (n) => {
        ctx.clearRect(0, 0, 1000, 1000);
        draw_lines(n)
    }

    const draw_all = (n) => {
        draw_lines(n)
    }

    function clearAll() {
        for (let i = setTimeout(function () {
        }, 0); i > 0; i--) {
            window.clearInterval(i);
            window.clearTimeout(i);
        }
    }

    const async_draw = (func) => {
        clearAll()
        x = [];
        t = [];
        solve_equation()
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let n = 0; n < nt; n++) {
            setTimeout(() => func(n), coef_t_input.value * n)
        }
    }

    const add_event_btn = () => {
        start_btn.addEventListener('click', () => async_draw(draw_anim))
        draw_btn.addEventListener('click', () => async_draw(draw_all))
    }
    add_event_btn()
}
