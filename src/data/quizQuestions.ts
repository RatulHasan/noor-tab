import type { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  // ── Quran (20 questions) ──
  {
    id: "quiz_quran_01",
    category: "quran",
    question: "How many Surahs are in the Holy Quran?",
    options: ["112", "113", "114", "115"],
    correctIndex: 2,
    explanation: "The Quran contains exactly 114 Surahs, beginning with Al-Fatihah and ending with An-Nas.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_02",
    category: "quran",
    question: "What is the longest Surah in the Holy Quran?",
    options: ["Al-Imran", "Al-Baqarah", "An-Nisa", "Al-Ma'idah"],
    correctIndex: 1,
    explanation: "Surah Al-Baqarah is the longest Surah in the Quran, consisting of 286 verses.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_03",
    category: "quran",
    question: "Which Surah does not begin with the Basmalah ('Bismillah...')?",
    options: ["Al-Kahf", "Al-Anfal", "At-Tawbah", "Al-Muzzammil"],
    correctIndex: 2,
    explanation: "Surah At-Tawbah (also known as Bara'ah) is the only Surah in the Quran that does not start with 'Bismillah-ir-Rahman-ir-Rahim'.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_04",
    category: "quran",
    question: "Which Surah contains two Basmalahs?",
    options: ["An-Naml", "Al-Hajj", "An-Nur", "Al-Mulk"],
    correctIndex: 0,
    explanation: "Surah An-Naml contains two Basmalahs: one at the beginning, and another in verse 30 in the letter sent by Prophet Sulaiman.",
    difficulty: "medium"
  },
  {
    id: "quiz_quran_05",
    category: "quran",
    question: "How many Juz (parts) are in the Holy Quran?",
    options: ["20", "30", "40", "50"],
    correctIndex: 1,
    explanation: "The Holy Quran is divided into 30 parts of roughly equal length, known as Juz.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_06",
    category: "quran",
    question: "Which Ayah is considered the greatest verse in the Quran?",
    options: ["Ayah ash-Shahadah", "Ayat al-Kursi", "Ayat al-Mulk", "Ayat al-Qard"],
    correctIndex: 1,
    explanation: "Ayat al-Kursi (Surah Al-Baqarah 2:255) is regarded as the greatest verse in the Quran according to authentic Hadith.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_07",
    category: "quran",
    question: "Who was the only companion of Prophet Muhammad (pbuh) mentioned by name in the Quran?",
    options: ["Abu Bakr", "Umar", "Ali", "Zayd bin Harithah"],
    correctIndex: 3,
    explanation: "Zayd bin Harithah (ra) is the only companion mentioned by name in the Quran (Surah Al-Ahzab 33:37).",
    difficulty: "medium"
  },
  {
    id: "quiz_quran_08",
    category: "quran",
    question: "Which Surah is equivalent to one-third of the Quran in reward?",
    options: ["Al-Fatihah", "Al-Ikhlas", "Al-Mulk", "Al-Waqi'ah"],
    correctIndex: 1,
    explanation: "Prophet Muhammad (pbuh) said that reciting Surah Al-Ikhlas is equivalent to reciting one-third of the Quran in terms of reward.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_09",
    category: "quran",
    question: "Which Surah is known as the 'Heart of the Quran'?",
    options: ["Al-Fatihah", "Al-Kahf", "Ya-Sin", "Ar-Rahman"],
    correctIndex: 2,
    explanation: "Surah Ya-Sin is widely referred to as the 'Heart of the Quran' based on historical scholarly traditions.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_10",
    category: "quran",
    question: "Which prophet is mentioned most frequently in the Quran?",
    options: ["Prophet Ibrahim", "Prophet Musa", "Prophet Isa", "Prophet Muhammad"],
    correctIndex: 1,
    explanation: "Prophet Musa (Moses) is mentioned the most in the Quran, appearing 136 times across various Surahs.",
    difficulty: "medium"
  },
  {
    id: "quiz_quran_11",
    category: "quran",
    question: "Which Surah is named after the 'Bride of the Quran'?",
    options: ["Al-Waqi'ah", "Ar-Rahman", "An-Nur", "Yusuf"],
    correctIndex: 1,
    explanation: "Surah Ar-Rahman is referred to as 'Aroos al-Quran' (the Bride of the Quran) because of its beautiful, rhythmic verse structures.",
    difficulty: "medium"
  },
  {
    id: "quiz_quran_12",
    category: "quran",
    question: "In which month was the Holy Quran first revealed?",
    options: ["Rajab", "Sha'ban", "Ramadan", "Dhul-Hijjah"],
    correctIndex: 2,
    explanation: "The Quran was first revealed during the blessed month of Ramadan, specifically on Laylat al-Qadr (the Night of Decree).",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_13",
    category: "quran",
    question: "What is the shortest Surah in the Holy Quran?",
    options: ["Al-Asr", "Al-Kafirun", "Al-Kawthar", "An-Nas"],
    correctIndex: 2,
    explanation: "Surah Al-Kawthar is the shortest Surah in the Holy Quran, consisting of only 3 verses.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_14",
    category: "quran",
    question: "Which Surah is named after a woman?",
    options: ["An-Nisa", "Maryam", "Al-Mujadila", "Fatima"],
    correctIndex: 1,
    explanation: "Surah Maryam is the only Surah named after a woman, Mary (the mother of Jesus).",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_15",
    category: "quran",
    question: "How many prostrations of recitation (Sajdah al-Tilawah) are in the Holy Quran?",
    options: ["10", "12", "14", "15"],
    correctIndex: 3,
    explanation: "There are 15 prostrations of recitation (Sajdahs) marked throughout the Holy Quran in standard recitation copies.",
    difficulty: "medium"
  },
  {
    id: "quiz_quran_16",
    category: "quran",
    question: "What is the name of the angel responsible for delivering the Quranic revelations?",
    options: ["Angel Mika'il", "Angel Jibril", "Angel Israfil", "Angel Azra'il"],
    correctIndex: 1,
    explanation: "Angel Jibril (Gabriel) was tasked by Allah with conveying the revelations to Prophet Muhammad (pbuh).",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_17",
    category: "quran",
    question: "Which Surah is recommended to be read every Friday for protection and light?",
    options: ["Al-Mulk", "Al-Kahf", "Al-Waqi'ah", "Al-Fath"],
    correctIndex: 1,
    explanation: "Reciting Surah Al-Kahf on Fridays provides a light of protection and spiritual guidance from one Friday to the next.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_18",
    category: "quran",
    question: "Who compiled the first complete written volume of the Quran during the Caliphate?",
    options: ["Abu Bakr as-Siddiq", "Umar ibn al-Khattab", "Uthman ibn Affan", "Ali ibn Abi Talib"],
    correctIndex: 0,
    explanation: "Under the instruction of Caliph Abu Bakr (ra), Zayd ibn Thabit (ra) compiled the first unified copy of the Quran.",
    difficulty: "medium"
  },
  {
    id: "quiz_quran_19",
    category: "quran",
    question: "Which Surah protects against the torment of the grave if read daily?",
    options: ["Ya-Sin", "Al-Mulk", "Ar-Rahman", "Al-Hadid"],
    correctIndex: 1,
    explanation: "Surah Al-Mulk (The Sovereignty) contains 30 verses that intercede for its reciter until they are forgiven and protected in the grave.",
    difficulty: "easy"
  },
  {
    id: "quiz_quran_20",
    category: "quran",
    question: "What are the two main divisions of Surahs based on the place of revelation?",
    options: ["Makki and Madani", "Eastern and Western", "Early and Late", "High and Low"],
    correctIndex: 0,
    explanation: "Surahs are classified as Makki (revealed before migration to Madinah) and Madani (revealed after migration).",
    difficulty: "easy"
  },

  // ── Seerah (20 questions) ──
  {
    id: "quiz_seerah_01",
    category: "seerah",
    question: "In which year was Prophet Muhammad (pbuh) born?",
    options: ["560 CE", "570 CE", "580 CE", "590 CE"],
    correctIndex: 1,
    explanation: "Prophet Muhammad (pbuh) was born in the year 570 CE, in Makkah, famously known as the 'Year of the Elephant'.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_02",
    category: "seerah",
    question: "What was the name of the Prophet's mother?",
    options: ["Halimah", "Aminah", "Fatimah", "Khadijah"],
    correctIndex: 1,
    explanation: "Aminah bint Wahb was the mother of Prophet Muhammad (pbuh). She passed away when he was six years old.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_03",
    category: "seerah",
    question: "Who was the first woman to accept Islam?",
    options: ["Aisha bint Abu Bakr", "Khadijah bint Khuwaylid", "Fatimah bint Muhammad", "Sawdah bint Zam'ah"],
    correctIndex: 1,
    explanation: "Khadijah (ra), the beloved first wife of Prophet Muhammad (pbuh), was the very first person to accept his message and convert to Islam.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_04",
    category: "seerah",
    question: "At what age did Prophet Muhammad (pbuh) receive the first revelation?",
    options: ["25", "30", "35", "40"],
    correctIndex: 3,
    explanation: "The Prophet (pbuh) was 40 years old when he received the first Quranic revelation in the Cave of Hira.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_05",
    category: "seerah",
    question: "What was the title given to the Prophet (pbuh) in Makkah before his prophethood due to his honesty?",
    options: ["Al-Hakim", "Al-Amin", "Al-Mansur", "Al-Rashid"],
    correctIndex: 1,
    explanation: "The Makkans called him 'Al-Amin' (The Trustworthy) and 'As-Sadiq' (The Truthful) because of his exemplary honesty and integrity.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_06",
    category: "seerah",
    question: "What is the name of the cave where the first revelation was sent?",
    options: ["Cave of Thawr", "Cave of Hira", "Cave of Kahf", "Cave of Uhud"],
    correctIndex: 1,
    explanation: "The first revelation was received in the Cave of Hira, located on Jabal al-Nour near Makkah.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_07",
    category: "seerah",
    question: "Which of the Prophet's uncles was a severe opponent of Islam?",
    options: ["Hamzah", "Abu Talib", "Abu Lahab", "Al-Abbas"],
    correctIndex: 2,
    explanation: "Abu Lahab was one of the Prophet's uncles who rejected his message, actively mocked him, and is condemned in Surah Al-Masad.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_08",
    category: "seerah",
    question: "What was the name of the camel that the Prophet (pbuh) rode during his migration (Hijrah) to Madinah?",
    options: ["Qaswa", "Zuljanah", "Duldul", "Yafur"],
    correctIndex: 0,
    explanation: "The Prophet's camel was named Al-Qaswa. She carried him during the historic migration and chose the location of his mosque in Madinah.",
    difficulty: "medium"
  },
  {
    id: "quiz_seerah_09",
    category: "seerah",
    question: "What was the first battle fought between the Muslims of Madinah and the Quraysh of Makkah?",
    options: ["Battle of Uhud", "Battle of Badr", "Battle of the Trench", "Battle of Khaybar"],
    correctIndex: 1,
    explanation: "The Battle of Badr, fought in 2 AH (624 CE), was the first decisive engagement where 313 Muslims defeated a much larger Makkan army.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_10",
    category: "seerah",
    question: "Which companion traveled with the Prophet (pbuh) during the Hijrah migration?",
    options: ["Umar ibn al-Khattab", "Abu Bakr as-Siddiq", "Ali ibn Abi Talib", "Uthman ibn Affan"],
    correctIndex: 1,
    explanation: "Abu Bakr (ra) was selected by the Prophet (pbuh) as his companion and companion of the cave during the dangerous escape to Madinah.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_11",
    category: "seerah",
    question: "What was the name of the treaty signed between Makkah and Madinah in 6 AH?",
    options: ["Treaty of Madinah", "Treaty of Hudaybiyyah", "Treaty of Taif", "Treaty of Aqabah"],
    correctIndex: 1,
    explanation: "The Treaty of Hudaybiyyah was a critical 10-year peace treaty that allowed the Muslims of Madinah to perform pilgrimage the following year.",
    difficulty: "medium"
  },
  {
    id: "quiz_seerah_12",
    category: "seerah",
    question: "Which of the Prophet's daughters married Ali ibn Abi Talib?",
    options: ["Ruqayyah", "Zaynab", "Fatimah", "Umm Kulthum"],
    correctIndex: 2,
    explanation: "Fatimah (ra), the youngest daughter of the Prophet (pbuh), was married to his cousin Ali ibn Abi Talib (ra).",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_13",
    category: "seerah",
    question: "What was the Year of Sorrow (Aam al-Huzn) in the Prophet's life?",
    options: ["Year of his mother's death", "Year both Khadijah and Abu Talib died", "Year of the Battle of Uhud", "Year of the Hijrah"],
    correctIndex: 1,
    explanation: "The 10th year of prophethood is called the Year of Sorrow because the Prophet (pbuh) lost both his uncle Abu Talib and his beloved wife Khadijah.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_14",
    category: "seerah",
    question: "What is the miraculous night journey of the Prophet (pbuh) from Makkah to Jerusalem and heaven called?",
    options: ["Hijrah", "Isra and Mi'raj", "Ghazwah", "Bay'ah"],
    correctIndex: 1,
    explanation: "Al-Isra (journey to Jerusalem) and Al-Mi'raj (ascension to the heavens) was a miraculous single-night journey where the five daily prayers were ordained.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_15",
    category: "seerah",
    question: "Who was the Prophet's grandfather who took care of him after his mother's death?",
    options: ["Abu Talib", "Abdul Muttalib", "Hashim", "Abdu Manaf"],
    correctIndex: 1,
    explanation: "Abdul Muttalib, the chief of the Quraysh tribe, cared for the young Prophet (pbuh) until his own death, when the Prophet was eight.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_16",
    category: "seerah",
    question: "What was the name of the Christian king of Abyssinia (Ethiopia) who sheltered the first Muslim refugees?",
    options: ["Heraclius", "Negus (Najashi)", "Chosroes", "Muqawqis"],
    correctIndex: 1,
    explanation: "Negus (Al-Najashi) was a just Christian king who gave asylum to early Muslim immigrants fleeing Makkan persecution.",
    difficulty: "medium"
  },
  {
    id: "quiz_seerah_17",
    category: "seerah",
    question: "Who was the wet-nurse who fostered the Prophet (pbuh) in the desert during his infancy?",
    options: ["Thuwaybah", "Halimah as-Sa'diyyah", "Umm Ayman", "Aminah"],
    correctIndex: 1,
    explanation: "Halimah (ra) from the tribe of Banu Sa'd raised the infant Prophet (pbuh) in the clean desert air as was Custom.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_18",
    category: "seerah",
    question: "In which Islamic year did the Conquest of Makkah take place?",
    options: ["6 AH", "8 AH", "10 AH", "11 AH"],
    correctIndex: 1,
    explanation: "The peaceful Conquest of Makkah took place in Ramadan of 8 AH (630 CE), leading to the cleaning of idols from the Kaaba.",
    difficulty: "medium"
  },
  {
    id: "quiz_seerah_19",
    category: "seerah",
    question: "Where did the Prophet (pbuh) deliver his famous Farewell Sermon (Khutbah al-Wada)?",
    options: ["Masjid al-Haram", "Masjid an-Nabawi", "Mount Arafat", "Mina"],
    correctIndex: 2,
    explanation: "The Prophet (pbuh) delivered his historic Farewell Sermon on Mount Arafat (Jabal al-Rahmah) during his final Hajj in 10 AH.",
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_20",
    category: "seerah",
    question: "Where is Prophet Muhammad (pbuh) buried?",
    options: ["Makkah", "Jerusalem", "Madinah", "Taif"],
    correctIndex: 2,
    explanation: "The Prophet (pbuh) passed away in the apartment of his wife Aisha (ra) in Madinah and is buried there, beneath the Green Dome of Masjid an-Nabawi.",
    difficulty: "easy"
  },

  // ── Fiqh (20 questions) ──
  {
    id: "quiz_fiqh_01",
    category: "fiqh",
    question: "How many times a day is a Muslim obligated to perform standard prayers (Salah)?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "The five daily obligatory prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) are a pillar of Islam.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_02",
    category: "fiqh",
    question: "What is the Arabic word for the dry purification performed with clean earth when water is unavailable?",
    options: ["Wudu", "Ghusl", "Tayammum", "Istinja"],
    correctIndex: 2,
    explanation: "Tayammum is the clean sand or dust purification permitted when water is scarce, unsafe, or unavailable.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_03",
    category: "fiqh",
    question: "Which prayer does not have any Sunnah or voluntary prayers immediately following it?",
    options: ["Dhuhr", "Maghrib", "Isha", "Asr"],
    correctIndex: 3,
    explanation: "According to standard Fiqh, there is a general prohibition on performing voluntary prayers immediately after the Asr prayer until sunset.",
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_04",
    category: "fiqh",
    question: "What is the minimum percentage of accumulated wealth that must be given as Zakat annually?",
    options: ["1.5%", "2.5%", "5.0%", "10.0%"],
    correctIndex: 1,
    explanation: "Zakat is calculated as 2.5% of a Muslim's qualifying surplus wealth (beyond the Nisab threshold) held for a full lunar year.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_05",
    category: "fiqh",
    question: "What is the threshold of wealth that makes Zakat obligatory called in Fiqh?",
    options: ["Nisab", "Sadaqah", "Fard", "Halal"],
    correctIndex: 0,
    explanation: "Nisab is the minimum amount of wealth or assets a Muslim must possess before they are obligated to pay Zakat.",
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_06",
    category: "fiqh",
    question: "Which action invalidates an active fast (Sawm)?",
    options: ["Using the siwak (toothbrush)", "Deliberately eating or drinking", "Swallowing one's saliva", "Taking a shower"],
    correctIndex: 1,
    explanation: "Deliberately eating or drinking during the hours of daylight immediately breaks and invalidates the fast.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_07",
    category: "fiqh",
    question: "What is the name of the voluntary prayer performed in congregation during the nights of Ramadan?",
    options: ["Tahajjud", "Tarawih", "Witr", "Duha"],
    correctIndex: 1,
    explanation: "Tarawih is a highly recommended congregational prayer performed after the Isha prayer during the month of Ramadan.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_08",
    category: "fiqh",
    question: "What is the direction of the Qibla that Muslims face during prayer?",
    options: ["Towards Jerusalem", "Towards the East", "Towards the Kaaba in Makkah", "Towards the sun"],
    correctIndex: 2,
    explanation: "Muslims are obligated to face the direction of the Kaaba in Makkah during their prayers.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_09",
    category: "fiqh",
    question: "Which posture is the act of bowing down in prayer called?",
    options: ["Ruku", "Sajdah", "Qiyam", "Tashahhud"],
    correctIndex: 0,
    explanation: "Ruku is the bowing position in prayer, keeping the back straight and hands on the knees.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_10",
    category: "fiqh",
    question: "What is the ruling (hukm) of performing Hajj once in a lifetime for a capable Muslim?",
    options: ["Sunnah (Recommended)", "Fard (Obligatory)", "Mustahabb (Liked)", "Mubah (Permissible)"],
    correctIndex: 1,
    explanation: "Hajj is one of the five pillars of Islam and is Fard (obligatory) once in a lifetime for those physically and financially able.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_11",
    category: "fiqh",
    question: "How many units (Rak'ahs) are in the Fajr obligatory prayer?",
    options: ["2", "3", "4", "5"],
    correctIndex: 0,
    explanation: "The Fajr obligatory prayer (Fard) consists of exactly 2 Rak'ahs.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_12",
    category: "fiqh",
    question: "Which of the following breaks your Wudu (ablution)?",
    options: ["Drinking water", "Passing gas or using the restroom", "Smiling", "Cutting your nails"],
    correctIndex: 1,
    explanation: "Using the restroom, passing gas, deep sleep, and loss of consciousness are actions that invalidate Wudu.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_13",
    category: "fiqh",
    question: "Which prayer is shortened (Qasr) by a traveler?",
    options: ["Maghrib", "Fajr", "Dhuhr, Asr, and Isha", "All prayers"],
    correctIndex: 2,
    explanation: "A traveler is permitted to shorten the 4-Rak'ah prayers (Dhuhr, Asr, Isha) to 2 Rak'ahs.",
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_14",
    category: "fiqh",
    question: "What is the name of the voluntary prayer performed mid-morning?",
    options: ["Witr", "Duha", "Tarawih", "Tahajjud"],
    correctIndex: 1,
    explanation: "Duha is a highly recommended voluntary prayer performed between sunrise and Dhuhr.",
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_15",
    category: "fiqh",
    question: "What is the legal ruling for eating pork in Islam?",
    options: ["Makruh (Disliked)", "Haram (Forbidden)", "Halal (Permitted)", "Mustahabb"],
    correctIndex: 1,
    explanation: "Pork is strictly classified as Haram (forbidden) in the Quran.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_16",
    category: "fiqh",
    question: "Which water is considered pure and usable for Wudu?",
    options: ["Flowing river or rainwater", "Water mixed with soap", "Fruit juice", "Stagnant, colored water"],
    correctIndex: 0,
    explanation: "Natural waters (rain, rivers, seas, wells) that retain their natural color, taste, and smell are pure and suitable for ablution.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_17",
    category: "fiqh",
    question: "What is the name of the sermon delivered during the Friday congregational prayer?",
    options: ["Hadith", "Khutbah", "Dua", "Dars"],
    correctIndex: 1,
    explanation: "The Khutbah is the sermon delivered by the Imam before the Friday congregational (Jumu'ah) prayer.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_18",
    category: "fiqh",
    question: "What are the two components of the testimony of faith (Shahadah)?",
    options: ["Belief in Allah and Angels", "Belief in Allah's Oneness and Muhammad's Prophethood", "Prayer and Fasting", "Charity and Hajj"],
    correctIndex: 1,
    explanation: "The Shahadah asserts that there is no deity worthy of worship except Allah, and Muhammad is His messenger.",
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_19",
    category: "fiqh",
    question: "What is the required charity distributed to the poor at the end of Ramadan before Eid prayer?",
    options: ["Zakat al-Mal", "Zakat al-Fitr", "Sadaqah Jariyah", "Waqf"],
    correctIndex: 1,
    explanation: "Zakat al-Fitr is an obligatory food charity given before the Eid al-Fitr prayer so the poor can also celebrate.",
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_20",
    category: "fiqh",
    question: "What is the term for the compensatory prostrations made at the end of prayer due to a mistake or omission?",
    options: ["Sajdah ash-Shukr", "Sajdah as-Sahw", "Sajdah al-Tilawah", "Ruku"],
    correctIndex: 1,
    explanation: "Sajdah as-Sahw (prostrations of forgetfulness) are two prostrations performed at the end of prayer to correct mistakes or omissions.",
    difficulty: "medium"
  },

  // ── History (20 questions) ──
  {
    id: "quiz_history_01",
    category: "history",
    question: "Who was the first Caliph of Islam after the death of the Prophet (pbuh)?",
    options: ["Umar ibn al-Khattab", "Ali ibn Abi Talib", "Abu Bakr as-Siddiq", "Uthman ibn Affan"],
    correctIndex: 2,
    explanation: "Abu Bakr (ra) was elected as the first Rightly Guided Caliph (Khalifah) and ruled from 11-13 AH.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_02",
    category: "history",
    question: "Who was the second Caliph, known as 'Al-Faruq' (The Distinguisher of Truth)?",
    options: ["Abu Bakr", "Umar ibn al-Khattab", "Uthman ibn Affan", "Ali ibn Abi Talib"],
    correctIndex: 1,
    explanation: "Umar ibn al-Khattab (ra) was the second Caliph, renowned for his justice, administrative reforms, and rapid expansion.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_03",
    category: "history",
    question: "During which Caliph's reign was the official standardized text of the Quran compiled and sent to major cities?",
    options: ["Abu Bakr", "Umar", "Uthman ibn Affan", "Ali"],
    correctIndex: 2,
    explanation: "Uthman ibn Affan (ra), the third Caliph, organized the standardization of the Quran's pronunciation and script to preserve it.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_04",
    category: "history",
    question: "Who was the fourth Caliph of Islam, who was also the cousin and son-in-law of the Prophet (pbuh)?",
    options: ["Abu Bakr", "Umar", "Uthman", "Ali ibn Abi Talib"],
    correctIndex: 3,
    explanation: "Ali ibn Abi Talib (ra) was the fourth and final of the Rightly Guided Caliphs (Khulafa-e-Rashidun).",
    difficulty: "easy"
  },
  {
    id: "quiz_history_05",
    category: "history",
    question: "What is the collective name given to the first four Caliphs of Islam?",
    options: ["Umayyads", "Abbasids", "Rashidun Caliphs", "Ottomans"],
    correctIndex: 2,
    explanation: "They are known as the Khulafa-e-Rashidun, meaning the Rightly Guided Caliphs.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_06",
    category: "history",
    question: "What was the capital of the Umayyad Caliphate?",
    options: ["Madinah", "Baghdad", "Damascus", "Cairo"],
    correctIndex: 2,
    explanation: "The Umayyad Caliphate (661-750 CE) established Damascus in Syria as its capital.",
    difficulty: "medium"
  },
  {
    id: "quiz_history_07",
    category: "history",
    question: "Which Caliphate is famously known for the 'Islamic Golden Age', centered in Baghdad?",
    options: ["Umayyad Caliphate", "Abbasid Caliphate", "Fatimid Caliphate", "Ottoman Caliphate"],
    correctIndex: 1,
    explanation: "The Abbasid Caliphate (750-1258 CE) presided over the Islamic Golden Age, promoting science, philosophy, and translation.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_08",
    category: "history",
    question: "What was the name of the famous library and intellectual academy in Baghdad during the Abbasid Golden Age?",
    options: ["House of Wisdom (Bayt al-Hikmah)", "Library of Alexandria", "Al-Azhar", "Al-Qarawiyyin"],
    correctIndex: 0,
    explanation: "Bayt al-Hikmah (House of Wisdom) was a major intellectual hub where scholars translated and advanced global scientific texts.",
    difficulty: "medium"
  },
  {
    id: "quiz_history_09",
    category: "history",
    question: "Which Muslim general liberated Jerusalem from Crusader rule in 1187 CE after the Battle of Hattin?",
    options: ["Khalid ibn al-Walid", "Salahuddin al-Ayyubi (Saladin)", "Tariq ibn Ziyad", "Muhammad bin Qasim"],
    correctIndex: 1,
    explanation: "Salahuddin al-Ayyubi (Saladin) successfully recaptured Jerusalem and was highly respected for his chivalry and justice.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_10",
    category: "history",
    question: "Who was the Muslim commander who led the conquest of Hispania (Spain) in 711 CE, naming Gibraltar after himself?",
    options: ["Tariq ibn Ziyad", "Uqbah bin Nafi", "Musa bin Nusayr", "Qutaybah bin Muslim"],
    correctIndex: 0,
    explanation: "Tariq ibn Ziyad landed at Gibraltar (Jabal Tariq, meaning Mount of Tariq) and initiated the Islamic history of Al-Andalus.",
    difficulty: "medium"
  },
  {
    id: "quiz_history_11",
    category: "history",
    question: "What was the name of the Islamic kingdom in Spain that became a center of European culture and learning?",
    options: ["Al-Andalus", "Sicily", "Ottoman Empire", "Safavid Empire"],
    correctIndex: 0,
    explanation: "Al-Andalus (711-1492 CE) was a beacon of tolerance, art, philosophy, and advanced technology in Medieval Europe.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_12",
    category: "history",
    question: "Which university, founded in Fez (Morocco) in 859 CE by Fatima al-Fihri, is the oldest continuously operating university?",
    options: ["Al-Azhar University", "University of Al-Qarawiyyin", "Nizamiyyah", "Sankore University"],
    correctIndex: 1,
    explanation: "The University of Al-Qarawiyyin, founded by a wealthy Muslim woman named Fatima al-Fihri, is recognized by UNESCO.",
    difficulty: "medium"
  },
  {
    id: "quiz_history_13",
    category: "history",
    question: "Which Caliph, often referred to as the 'Fifth Rightly Guided Caliph' due to his intense piety and reforms?",
    options: ["Muawiyah I", "Umar ibn Abdul Aziz", "Harun al-Rashid", "Al-Mamun"],
    correctIndex: 1,
    explanation: "Umar ibn Abdul Aziz (Umar II) of the Umayyad dynasty is celebrated for restoring justice and implementing public reforms.",
    difficulty: "medium"
  },
  {
    id: "quiz_history_14",
    category: "history",
    question: "Which empire captured Constantinople in 1453 CE under the leadership of Sultan Mehmed II?",
    options: ["Abbasid Empire", "Seljuk Empire", "Ottoman Empire", "Mughal Empire"],
    correctIndex: 2,
    explanation: "Sultan Mehmed II (Mehmed the Conqueror) led the Ottomans in capturing Constantinople, ending the Byzantine Empire.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_15",
    category: "history",
    question: "Who was the legendary Muslim traveler and scholar who traversed over 73,000 miles across Africa, Asia, and Europe?",
    options: ["Ibn Battuta", "Ibn Khaldun", "Al-Khwarizmi", "Ibn Sina"],
    correctIndex: 0,
    explanation: "Ibn Battuta (1304-1369 CE) is considered one of the greatest travelers in history, documenting his journeys in the Rihla.",
    difficulty: "medium"
  },
  {
    id: "quiz_history_16",
    category: "history",
    question: "Which dynasty built the Taj Mahal in Agra, India?",
    options: ["Ghaznavid Dynasty", "Delhi Sultanate", "Mughal Empire", "Ottoman Empire"],
    correctIndex: 2,
    explanation: "The Mughal Emperor Shah Jahan constructed the Taj Mahal in the 17th century as a mausoleum for his beloved wife.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_17",
    category: "history",
    question: "Who is known as the father of modern Algebra, whose name gave rise to the term 'algorithm'?",
    options: ["Al-Biruni", "Al-Khwarizmi", "Ibn al-Haytham", "Jabir ibn Hayyan"],
    correctIndex: 1,
    explanation: "Muhammad ibn Musa al-Khwarizmi wrote 'Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala', originating the term Algebra.",
    difficulty: "medium"
  },
  {
    id: "quiz_history_18",
    category: "history",
    question: "Which city was destroyed by the Mongols in 1258 CE, marking the tragic end of the Abbasid Golden Age?",
    options: ["Damascus", "Cairo", "Baghdad", "Cordoba"],
    correctIndex: 2,
    explanation: "The Mongol army led by Hulagu Khan sacked Baghdad in 1258 CE, destroying libraries, architectural wonders, and ending the Caliphate.",
    difficulty: "easy"
  },
  {
    id: "quiz_history_19",
    category: "history",
    question: "Which Caliphate established the great library and mosque city of Cordoba in Spain?",
    options: ["Fatimid Caliphate", "Abbasid Caliphate", "Umayyad Caliphate of Cordoba", "Almohad Caliphate"],
    correctIndex: 2,
    explanation: "The Umayyad Emirate/Caliphate of Cordoba, founded by Abd al-Rahman I, built Cordoba into the most advanced city in Europe.",
    difficulty: "medium"
  },
  {
    id: "quiz_history_20",
    category: "history",
    question: "Who was the famous Muslim sociologist and historian who wrote the 'Muqaddimah'?",
    options: ["Ibn Khaldun", "Ibn Rushd", "Al-Farabi", "Ibn Hazm"],
    correctIndex: 0,
    explanation: "Ibn Khaldun (1332-1406 CE) wrote the Muqaddimah (Introduction), establishing the foundations of modern sociology and historiography.",
    difficulty: "medium"
  },

  // ── General Knowledge (20 questions) ──
  {
    id: "quiz_general_01",
    category: "general",
    question: "What are the five core pillars of Islam?",
    options: [
      "Faith, Prayer, Charity, Fasting, Pilgrimage",
      "Jihad, Hijrah, Dhikr, Knowledge, Kindness",
      "Wudu, Adhan, Quran, Mosque, Eid",
      "Justice, Equality, Peace, Love, Sincerity"
    ],
    correctIndex: 0,
    explanation: "The five pillars of Islam are: Shahadah (Faith), Salah (Prayer), Zakat (Charity), Sawm (Fasting), and Hajj (Pilgrimage).",
    difficulty: "easy"
  },
  {
    id: "quiz_general_02",
    category: "general",
    question: "What is the Islamic calendar called?",
    options: ["Lunar Calendar", "Gregorian Calendar", "Hijri Calendar", "Solar Calendar"],
    correctIndex: 2,
    explanation: "The Islamic calendar is the Hijri Calendar, based on the lunar cycle, starting from the year of the migration (Hijrah) of the Prophet.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_03",
    category: "general",
    question: "How many months are in the Hijri calendar?",
    options: ["10", "11", "12", "13"],
    correctIndex: 2,
    explanation: "Like the Gregorian calendar, the Hijri calendar has exactly 12 months, though they are lunar and vary between 29 and 30 days.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_04",
    category: "general",
    question: "What is the first month of the Islamic Hijri year?",
    options: ["Ramadan", "Shawwal", "Muharram", "Dhul-Hijjah"],
    correctIndex: 2,
    explanation: "Muharram is the first month of the Islamic Hijri calendar, representing a time of reflection.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_05",
    category: "general",
    question: "What is the holiest sanctuary in Islam, located in Makkah?",
    options: ["Masjid an-Nabawi", "Masjid al-Aqsa", "Masjid al-Haram (The Sacred Mosque)", "Masjid Quba"],
    correctIndex: 2,
    explanation: "Masjid al-Haram, containing the Kaaba in Makkah, is the holiest mosque and sanctuary in Islam.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_06",
    category: "general",
    question: "What is the second holiest mosque in Islam, located in Madinah?",
    options: ["Masjid al-Aqsa", "Masjid an-Nabawi (The Prophet's Mosque)", "Masjid Quba", "Masjid al-Kiblatayn"],
    correctIndex: 1,
    explanation: "Masjid an-Nabawi (The Prophet's Mosque) in Madinah is the second holiest sanctuary in Islam.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_07",
    category: "general",
    question: "What is the third holiest mosque in Islam, located in Jerusalem?",
    options: ["Masjid al-Aqsa", "Dome of the Rock", "Masjid al-Haram", "Masjid al-Qiblatayn"],
    correctIndex: 0,
    explanation: "Masjid al-Aqsa in Jerusalem is the third holiest sanctuary and was the first Qibla of Islam before the Kaaba.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_08",
    category: "general",
    question: "What is the primary language of the Quran and Islamic scholarly texts?",
    options: ["Persian", "Turkish", "Arabic", "Urdu"],
    correctIndex: 2,
    explanation: "Classical Arabic is the language of the Holy Quran, which has preserved it for over 1,400 years.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_09",
    category: "general",
    question: "What are the two major festivals celebrated by Muslims worldwide?",
    options: [
      "Eid al-Fitr and Eid al-Adha",
      "Mawlid and Shab-e-Barat",
      "Muharram and Ashura",
      "Ramadan and Laylat al-Qadr"
    ],
    correctIndex: 0,
    explanation: "Eid al-Fitr (celebrating the end of Ramadan) and Eid al-Adha (celebrating Hajj and Ibrahim's sacrifice) are the two major celebrations.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_10",
    category: "general",
    question: "What does the word 'Islam' literally mean in Arabic?",
    options: ["Faith", "Submission / Peace", "Wisdom", "Struggle"],
    correctIndex: 1,
    explanation: "Islam is derived from the root 's-l-m', which means peace, safety, and submission to the will of Allah.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_11",
    category: "general",
    question: "What is the name of the sacred spring of water located inside the Masjid al-Haram?",
    options: ["Spring of Quba", "Well of Zamzam", "Salsabil", "Kauthar"],
    correctIndex: 1,
    explanation: "Zamzam is a miraculously flowing water source provided by Allah to Hajar and her infant son Ishmael.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_12",
    category: "general",
    question: "What is the name of the first mosque built in Islamic history, located near Madinah?",
    options: ["Masjid an-Nabawi", "Masjid al-Aqsa", "Masjid Quba", "Masjid al-Kiblatayn"],
    correctIndex: 2,
    explanation: "Masjid Quba was the first mosque constructed by Prophet Muhammad (pbuh) and his companions upon arriving in Madinah.",
    difficulty: "medium"
  },
  {
    id: "quiz_general_13",
    category: "general",
    question: "How many articles of faith (Iman) are in Islam?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
    explanation: "There are six articles of faith: Belief in Allah, His Angels, His Books, His Messengers, the Day of Judgment, and Divine Decree (Qadr).",
    difficulty: "easy"
  },
  {
    id: "quiz_general_14",
    category: "general",
    question: "Which month of the Hijri calendar is dedicated to daily obligatory fasting?",
    options: ["Rajab", "Sha'ban", "Ramadan", "Shawwal"],
    correctIndex: 2,
    explanation: "Ramadan, the 9th month of the Hijri calendar, is the month of mercy and obligatory fasting.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_15",
    category: "general",
    question: "In which Hijri month is the annual pilgrimage (Hajj) performed?",
    options: ["Ramadan", "Muharram", "Dhul-Hijjah", "Shawwal"],
    correctIndex: 2,
    explanation: "The rites of Hajj are performed between the 8th and 12th days of Dhul-Hijjah, the 12th and final month of the Islamic year.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_16",
    category: "general",
    question: "What is the name of the night in Ramadan that is better than a thousand months?",
    options: ["Laylat al-Qadr (Night of Decree)", "Laylat al-Bara'ah", "Isra and Mi'raj", "Shab-e-Qadr"],
    correctIndex: 0,
    explanation: "Laylat al-Qadr (Surah Al-Qadr) is the most sacred night in the year, better than 1,000 months of standard worship.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_17",
    category: "general",
    question: "What is the name of the call to prayer announced by the Mu'adhdhin?",
    options: ["Iqamah", "Adhan", "Khutbah", "Dua"],
    correctIndex: 1,
    explanation: "The Adhan is the public call to prayer recited at the beginning of each salah window.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_18",
    category: "general",
    question: "Who was the first designated Mu'adhdhin (caller to prayer) in Islam, chosen for his beautiful voice?",
    options: ["Zayd bin Harithah", "Bilal ibn Rabah", "Abdullah ibn Umar", "Abu Hurairah"],
    correctIndex: 1,
    explanation: "Bilal ibn Rabah (ra), an African companion known for his loyalty and beautiful voice, was chosen by the Prophet (pbuh) as the first Mu'adhdhin.",
    difficulty: "easy"
  },
  {
    id: "quiz_general_19",
    category: "general",
    question: "Which city is the burial place of the early Caliphs and thousands of companions, located next to the Prophet's Mosque?",
    options: ["Jannat al-Mu'alla", "Jannat al-Baqi", "Wadi-us-Salaam", "Arafat"],
    correctIndex: 1,
    explanation: "Jannat al-Baqi (Garden of Baqi) in Madinah is the primary cemetery where many of the Prophet's family and companions rest.",
    difficulty: "medium"
  },
  {
    id: "quiz_general_20",
    category: "general",
    question: "What does the Arabic phrase 'JazakAllahu Khayran' mean?",
    options: [
      "May Allah reward you with goodness",
      "Thank you very much",
      "Peace be upon you",
      "May Allah forgive you"
    ],
    correctIndex: 0,
    explanation: "JazakAllahu Khayran is a sunnah expression of gratitude meaning 'May Allah reward you with goodness'.",
    difficulty: "easy"
  }
];
