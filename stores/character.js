import { defineStore } from "pinia";
import { ref } from "vue";

export const useCharacterStore = defineStore("character", () => {
    const selectedCharacter = ref(null);

    const setCharacter = (character) => {
        selectedCharacter.value = character;

        if (process.client) {
            localStorage.setItem("selectedCharacter", JSON.stringify(character));
        }
    };

    const loadCharacterFromStorage = () => {
        if (process.client) {
            const storedCharacter = localStorage.getItem("selectedCharacter");
            if (storedCharacter) {
                selectedCharacter.value = JSON.parse(storedCharacter);
            }
        }
    };

    return { selectedCharacter, setCharacter, loadCharacterFromStorage };
});