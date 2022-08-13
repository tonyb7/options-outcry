import animals from "../public/animals.json"

export function generateName() {
    return "Anonymous " + animals[Math.floor(Math.random() * animals.length)];
}
