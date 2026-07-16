// "One Day — Maria Clara" branching quiz content
// Content and mechanic transcribed from Maria_Clara_Quiz_Reference.docx

const QUIZ_NODES = {
  1: {
    time: "Dawn",
    title: "She Wakes",
    bg: "dawn-bg",
    backdrop: "images/quiz-dawn.jpg",
    narration: "Light comes in grey through the capiz shell windows, softening slowly to gold. The house is quiet — for now. Maria Clara lies still a moment, listening to the far-off sound of the river, before the day's obligations find her.",
    prompt: "How does she meet the morning?",
    choices: [
      { text: "She folds her hands and prays, as she was taught.",
        reaction: "She prays the way she has always prayed. Carefully. Correctly. It steadies her, though she could not say for what.",
        next: 2 },
      { text: "She looks toward the garden, thinking of nothing in particular.",
        reaction: "For a moment her mind wanders past the walls of the house, toward something she has no name for yet.",
        next: 2 },
      { text: "She rises at once — there is a household to attend to.",
        reaction: "There is no time to linger. The day has already begun without her permission.",
        next: 2 }
    ]
  },

  2: {
    time: "Morning",
    title: "Her Father's House",
    bg: "dawn-bg",
    backdrop: "images/quiz-dawn.jpg",
    narration: "Capitán Tiago is in good spirits over breakfast, full of talk about a distinguished young Spaniard — a nephew of Padre Dámaso's acquaintance, newly arrived — who has been asking after her. He says it lightly, as though it were nothing at all. It is not nothing.",
    prompt: "How does she respond?",
    choices: [
      { text: "She says nothing, and lets the moment pass.",
        reaction: "Silence is the safest answer she has been given, so silence is the one she gives back.",
        next: 3 },
      { text: "She changes the subject, gently, as she has learned to.",
        reaction: "She turns the conversation elsewhere, the way water turns around a stone — without ever stopping it.",
        next: 3 },
      { text: "She says she is not ready to think of such things.",
        reaction: "The words come out smaller than she meant them to. Her father laughs, kindly, and does not hear them at all.",
        next: 3 }
    ]
  },

  3: {
    time: "Midday",
    title: "Ibarra",
    bg: "dusk-bg",
    backdrop: "images/quiz-midday.jpg",
    narration: "He comes as he always does: through the garden, not the front door, as if the house itself has rules he'd rather not test. They speak of small things first: his travels, the estate, the schoolhouse he means to build. Then, quieter, of what neither of them has said plainly.",
    prompt: "What does she do, when he reaches for her hand?",
    choices: [
      { text: "She lets him take it, just for a moment.",
        reaction: "Just a moment. She allows herself that much, and no more. It will have to be enough to remember.",
        next: 4 },
      { text: "She withdraws it, glancing toward the house.",
        reaction: "Someone might be watching. There is always someone who might be watching.",
        next: 4 },
      { text: "She asks him, quietly, what will become of them.",
        reaction: "He has no real answer, only intentions. And intentions, she is beginning to understand, do not count for much here.",
        next: 4 }
    ]
  },

  4: {
    time: "Afternoon",
    title: "The Friars",
    bg: "dusk-bg",
    backdrop: "images/quiz-afternoon.jpg",
    narration: "Padre Dámaso arrives unannounced, as he often does, filling the room the way he fills every room. He speaks of duty, of family honor, of what is \u201cbest for her\u201d — never once asking what she wants, because it does not occur to him that this is a question worth asking.",
    prompt: "How does she meet him?",
    choices: [
      { text: "She lowers her eyes and says, \u201cYes, Padre.\u201d",
        reaction: "It is the answer expected of her, and so it is the one she gives.",
        next: 5 },
      { text: "She asks, carefully, why the decision isn't hers to make.",
        reaction: "The question hangs in the air a moment before it is talked over, gently but completely, as though she hadn't spoken.",
        selfLoop: true },
      { text: "She looks to her father, hoping he will speak for her.",
        reaction: "He looks away instead. Whatever protection she hoped for does not come.",
        selfLoop: true }
    ]
  },

  5: {
    time: "Dusk",
    title: "A Choice, So-Called",
    bg: "night-bg",
    backdrop: "images/quiz-night.jpg",
    narration: "By evening it has been arranged as though it were her idea — a life she is told to be grateful for, one way or another. She is given two doors and told to pick one. Both, she slowly realizes, lead to the same room.",
    prompt: "Which door does she take?",
    choices: [
      { text: "\u201cI will enter the Beaterio,\u201d she says, \u201cof my own will.\u201d",
        reaction: "She says the words as if choosing them makes them hers. It is the only ownership left to claim.",
        next: 6 },
      { text: "She says nothing, and lets them lead her toward the convent gates.",
        reaction: "There is no decision to make, only a direction to be walked in. She walks it.",
        next: 6 },
      { text: "She speaks her mind, saying what she truly thinks.",
        reaction: "She realizes what she was about to do and stops herself. She can't bring herself to do this.",
        selfLoop: true }
    ]
  },

  6: {
    time: "Night",
    title: "Behind the Walls",
    bg: "night-bg",
    backdrop: "images/quiz-night.jpg",
    narration: "The convent is quieter than the house ever was, and colder. What happens within those walls is not spoken of outside them — that, she comes to learn, is the point of walls like these. Padre Salv\u00ed's visits are frequent, and frequently unwelcome.",
    prompt: "How does she endure it?",
    choices: [
      { text: "She prays, the way she was taught, and waits for it to help.",
        reaction: "The prayers come easily. Relief does not come with them.",
        selfLoop: true },
      { text: "She goes silent, and stays that way.",
        reaction: "Silence becomes a room she can live inside, when no other room is safe.",
        selfLoop: true },
      { text: "She holds onto the memory of a garden, and a hand once held.",
        reaction: "It is the one thing they cannot arrange, revoke, or take a vow from her about.",
        selfLoop: true }
    ],
    leaveChoice: {
      text: "Leave.",
      reaction: "You can't leave.",
      next: 7
    }
  },

  7: {
    time: "Night — End",
    title: "The Door Does Not Open",
    bg: "night-bg",
    backdrop: "images/quiz-night.jpg",
    narration: "Whichever morning she woke to, whatever she said to her father, however she answered the friars, however she named her own \u201cchoice,\u201d she arrives here. Behind the walls. Unable to leave. The novel closes on her inside them; the sequel closes with her death inside them, and no clean answer as to what was done to her there.",
    footnote: "This is a fixed narrative: every choice in this story changes only the words along the way, never the destination — which is the point Rizal was making about Maria Clara's position in Noli Me Tangere. She is often read as a symbol of the Philippines itself: shaped, praised, and ultimately confined by the very institutions that claimed to protect her. Not every reader agrees this portrayal is a critique rather than a reinforcement of that ideal.",
    isEnd: true
  }
};

const TOTAL_NODES = 7;
