const hours = document.querySelector(".hours");
const minutes = document.querySelector(".minutes");

function updateTime() {
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (currentHour > 12) {
        currentHour -= 12;
    }

    const formattedHours = currentHour.toString();
    const formattedMinutes = currentMinute.toString().padStart(2, "0");

    hours.textContent = formattedHours;
    minutes.textContent = formattedMinutes;
}

setInterval(updateTime, 1000);
updateTime();

const display = document.getElementById("display");
const buttons = Array.from(document.querySelectorAll(".button"));

buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        const value = e.target.innerText;
        display.textContent = value;
    })
})