export const initMessages = [
    `היי, אני אריאל אזואלוס,
מתכנן פיננסי CFP ומנכ"ל FUTURE תכנון ואחזקות בע"מ
אשאל אותך כמה שאלות כדי לבדוק האם נוכל לסייע לך למקסם את ההון שברשותך ולהגיע למטרותיך הפיננסיות באמצעות תכנון פיננסי והשקעות.
`,
];

export const systemMessages = {
    startConversation: "מתחילים!",
    profileError: "אירעה שגיאה בניתוח הפרופיל. אנא נסה שוב מאוחר יותר.",
    success: `תודה רבה, ניצור איתך קשר בקרוב.
בנתיים אעביר אותך לדף עם קישור לתיאום השיחה.`,
};

// export const getGreetingMessage = (userName: string): string => {
//     return `נעים להכיר ${userName} 🤝🏻\nכדי שאוכל לבחון את אופי ההשקעה שלך, אשאל מספר שאלות פסיכולוגיות ופיננסיות ובעזרתן אערוך עבורך צ'ק אפ פיננסי ראשוני.`;
// };

// export const phoneRequestMessage = 
//     `מעולה!
// אשמח להזמין אותך לשיחת אבחון ללא עלות וללא התחייבות. 
// אני אעביר את כל התשובות למתכנן לטובת השיחה שתקבעו.

// מה הנייד שלך לתיאום השיחה?
// `;

export const getSelectedProfileDescription = (userName: string, profileName: string, profileDescription: string): string[] => {
    return [
        `${userName} תודה ששיתפת אותי!
        
בהתאם לשקלול התשובות שלך אתה המשקיע ה"${profileName}".
${profileDescription}`,
        `כדי שנוכל לבנות את אלוקציית ההשקעות שלך, נצטרך להגדיר מה המטרה שהכי חשוב לך להשיג, על מנת לבחון האם ניתן להשיג אותה בעזרת תהליך התכנון הפיננסי.`
    ];
};
