
export const getNoEventsFoundTag = () => {

    const noEventsFoundTags = [
        "No events yet! Your calendar's taking a little break.",
        "Nothing planned for now. Time to chill!",
        "No meetups on the horizon. Go create one!",
        "Your schedule's clear — maybe too clear!",
        "No events? Let's change that!",
        "Your calendar is feeling lonely 😢",
        "All dressed up and nowhere to go…",
        "The calendar's empty, but your social life doesn't have to be!",
        "Even calendars get sad when there's nothing to do.",
        "This calendar needs a little action. Tap + to plan something!",
        "No events… yet. The next great hangout is just a tap away!",
        "Quiet now, but memories are just one plan away!",
        "No events, no worries. New adventures await!"
    ]

    // return random array element
    const randomIndex = Math.floor(Math.random() * noEventsFoundTags.length);
    return noEventsFoundTags[randomIndex];
}