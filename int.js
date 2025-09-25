document.addEventListener("DOMContentLoaded", () => {
    const wisps = document.querySelectorAll(".sprite");
    const charaScene = document.getElementById("chara-scene");
    const character = document.getElementById("character");
    const speechBubble = document.getElementById("speech-bubble");
    const speechText = document.getElementById("speech");
    const closeBtn = document.getElementById("close-bubble");
    const wispSoundEffect = new Audio("wispclick.mp3"); 

    const backgroundMusic = new Audio("bg-audio.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    let backgroundStarted = false;

    function startBackgroundMusic() {
        if (!backgroundStarted) {
            backgroundMusic.play().catch(() => {
                console.log("Background music will start after user interaction.");
            });
            backgroundStarted = true;
        }
    }

    const characters = {
        one: { img: "Chara-1.png", text: "This forest was once ruled by humans and creatures alike. I tried to warn people of what was coming but nobody listened." },
        two: { img: "Chara-2.png", text: "Every day, smog from the factories continued to poison the solemn air I would fly and blacken the lungs of my family. Now all that's left is fog." },
        three: { img: "Chara-3.png", text: "Black oil entered my lake. It destroyed my only home. They kept putting it there. Now there is no water for me. For the trees. And for you." },
        four: { img: "Chara-4.png", text: "As a hunter, I made sure to respect this forest by hunting on only what I needed. I thought for a moment I contributed to this. Come to find out they were taking their surplus to stuff into the bellies of those who were already fed." },
        five: { img: "Chara-5.png", text: "The Sun doesn't shine here anymore. It doesn't want to. They have killed this place and its beings. Their polluted hearts have physically polluted us and taken us out, one by one." }
    };

    function startWiggle() {
        wisps.forEach((wisp, i) => {
            if (wisp.style.display === "none") return; // skip removed wisps
            gsap.to(wisp, {
                x: "+=" + (20 + Math.random() * 15),
                y: "+=" + (5 + i * 1.5),
                scale: 1.25,
                duration: 1 + i * 0.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.3
            });
        });
    }

    startWiggle();

    wisps.forEach(wisp => {
        wisp.addEventListener("click", () => {
            startBackgroundMusic();

            // Play wisp sound
            wispSoundEffect.currentTime = 0;
            wispSoundEffect.play();

            const charData = characters[wisp.id];
            if (!charData) return;

            gsap.killTweensOf(wisps);

            // Move all wisps up
            gsap.to(wisps, { y: "-=400", duration: 0.8, stagger: 0.2 });

            // Show character
            charaScene.classList.remove("hidden");
            character.src = charData.img;
            gsap.fromTo(character, 
                { x: "-500", opacity: 0 },
                { x: window.innerWidth / 2 - character.width / 2, opacity: 1, duration: 1 }
            );

            // Save clicked wisp info
            charaScene.dataset.activeWisp = wisp.id;
            charaScene.dataset.speech = charData.text;
        });
    });

    character.addEventListener("click", () => {
        const text = charaScene.dataset.speech || "";
        speechText.textContent = text;
        speechBubble.classList.remove("hidden");
        gsap.to(speechBubble, { opacity: 1, duration: 0.5 });
    });

    closeBtn.addEventListener("click", () => {
        gsap.to(speechBubble, { opacity: 0, duration: 0.3, onComplete: () => {
            speechBubble.classList.add("hidden");

            // Hide character
            gsap.to(character, { x: "-500", opacity: 0, duration: 0.8, onComplete: () => {
                charaScene.classList.add("hidden");

                // Remove clicked wisp permanently
                const activeWisp = charaScene.dataset.activeWisp;
                if (activeWisp) {
                    const clickedWisp = document.getElementById(activeWisp);
                    if (clickedWisp) clickedWisp.style.display = "none";
                }

                // Bring remaining wisps back and restart wiggle
                gsap.to(wisps, {
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    onComplete: startWiggle
                });
            }});
        }});
    });

});

