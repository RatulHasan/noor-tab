import type { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  // ── Quran (20 questions) ──
  {
    id: "quiz_quran_01",
    category: "quran",
    question: { en: "How many Surahs are in the Holy Quran?" },
    options: [
      { en: "112" },
      { en: "113" },
      { en: "114" },
      { en: "115" }
    ],
    correctIndex: 2,
    explanation: { en: "The Quran contains exactly 114 Surahs, beginning with Al-Fatihah and ending with An-Nas." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_02",
    category: "quran",
    question: { en: "What is the longest Surah in the Holy Quran?" },
    options: [
      { en: "Al-Imran" },
      { en: "Al-Baqarah" },
      { en: "An-Nisa" },
      { en: "Al-Ma'idah" }
    ],
    correctIndex: 1,
    explanation: { en: "Surah Al-Baqarah is the longest Surah in the Quran, consisting of 286 verses." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_03",
    category: "quran",
    question: { en: "Which Surah does not begin with the Basmalah ('Bismillah...')?" },
    options: [
      { en: "Al-Kahf" },
      { en: "Al-Anfal" },
      { en: "At-Tawbah" },
      { en: "Al-Muzzammil" }
    ],
    correctIndex: 2,
    explanation: { en: "Surah At-Tawbah (also known as Bara'ah) is the only Surah in the Quran that does not start with 'Bismillah-ir-Rahman-ir-Rahim'." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_04",
    category: "quran",
    question: { en: "Which Surah contains two Basmalahs?" },
    options: [
      { en: "An-Naml" },
      { en: "Al-Hajj" },
      { en: "An-Nur" },
      { en: "Al-Mulk" }
    ],
    correctIndex: 0,
    explanation: { en: "Surah An-Naml contains two Basmalahs: one at the beginning, and another in verse 30 in the letter sent by Prophet Sulaiman." },
    difficulty: "medium"
  },
  {
    id: "quiz_quran_05",
    category: "quran",
    question: { en: "How many Juz (parts) are in the Holy Quran?" },
    options: [
      { en: "20" },
      { en: "30" },
      { en: "40" },
      { en: "50" }
    ],
    correctIndex: 1,
    explanation: { en: "The Holy Quran is divided into 30 parts of roughly equal length, known as Juz." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_06",
    category: "quran",
    question: { en: "Which Ayah is considered the greatest verse in the Quran?" },
    options: [
      { en: "Ayah ash-Shahadah" },
      { en: "Ayat al-Kursi" },
      { en: "Ayat al-Mulk" },
      { en: "Ayat al-Qard" }
    ],
    correctIndex: 1,
    explanation: { en: "Ayat al-Kursi (Surah Al-Baqarah 2:255) is regarded as the greatest verse in the Quran according to authentic Hadith." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_07",
    category: "quran",
    question: { en: "Who was the only companion of Prophet Muhammad (pbuh) mentioned by name in the Quran?" },
    options: [
      { en: "Abu Bakr" },
      { en: "Umar" },
      { en: "Ali" },
      { en: "Zayd bin Harithah" }
    ],
    correctIndex: 3,
    explanation: { en: "Zayd bin Harithah (ra) is the only companion mentioned by name in the Quran (Surah Al-Ahzab 33:37)." },
    difficulty: "medium"
  },
  {
    id: "quiz_quran_08",
    category: "quran",
    question: { en: "Which Surah is equivalent to one-third of the Quran in reward?" },
    options: [
      { en: "Al-Fatihah" },
      { en: "Al-Ikhlas" },
      { en: "Al-Mulk" },
      { en: "Al-Waqi'ah" }
    ],
    correctIndex: 1,
    explanation: { en: "Prophet Muhammad (pbuh) said that reciting Surah Al-Ikhlas is equivalent to reciting one-third of the Quran in terms of reward." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_09",
    category: "quran",
    question: { en: "Which Surah is known as the 'Heart of the Quran'?" },
    options: [
      { en: "Al-Fatihah" },
      { en: "Al-Kahf" },
      { en: "Ya-Sin" },
      { en: "Ar-Rahman" }
    ],
    correctIndex: 2,
    explanation: { en: "Surah Ya-Sin is widely referred to as the 'Heart of the Quran' based on historical scholarly traditions." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_10",
    category: "quran",
    question: { en: "Which prophet is mentioned most frequently in the Quran?" },
    options: [
      { en: "Prophet Ibrahim" },
      { en: "Prophet Musa" },
      { en: "Prophet Isa" },
      { en: "Prophet Muhammad" }
    ],
    correctIndex: 1,
    explanation: { en: "Prophet Musa (Moses) is mentioned the most in the Quran, appearing 136 times across various Surahs." },
    difficulty: "medium"
  },
  {
    id: "quiz_quran_11",
    category: "quran",
    question: { en: "Which Surah is named after the 'Bride of the Quran'?" },
    options: [
      { en: "Al-Waqi'ah" },
      { en: "Ar-Rahman" },
      { en: "An-Nur" },
      { en: "Yusuf" }
    ],
    correctIndex: 1,
    explanation: { en: "Surah Ar-Rahman is referred to as 'Aroos al-Quran' (the Bride of the Quran) because of its beautiful, rhythmic verse structures." },
    difficulty: "medium"
  },
  {
    id: "quiz_quran_12",
    category: "quran",
    question: { en: "In which month was the Holy Quran first revealed?" },
    options: [
      { en: "Rajab" },
      { en: "Sha'ban" },
      { en: "Ramadan" },
      { en: "Dhul-Hijjah" }
    ],
    correctIndex: 2,
    explanation: { en: "The Quran was first revealed during the blessed month of Ramadan, specifically on Laylat al-Qadr (the Night of Decree)." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_13",
    category: "quran",
    question: { en: "What is the shortest Surah in the Holy Quran?" },
    options: [
      { en: "Al-Asr" },
      { en: "Al-Kafirun" },
      { en: "Al-Kawthar" },
      { en: "An-Nas" }
    ],
    correctIndex: 2,
    explanation: { en: "Surah Al-Kawthar is the shortest Surah in the Holy Quran, consisting of only 3 verses." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_14",
    category: "quran",
    question: { en: "Which Surah is named after a woman?" },
    options: [
      { en: "An-Nisa" },
      { en: "Maryam" },
      { en: "Al-Mujadila" },
      { en: "Fatima" }
    ],
    correctIndex: 1,
    explanation: { en: "Surah Maryam is the only Surah named after a woman, Mary (the mother of Jesus)." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_15",
    category: "quran",
    question: { en: "How many prostrations of recitation (Sajdah al-Tilawah) are in the Holy Quran?" },
    options: [
      { en: "10" },
      { en: "12" },
      { en: "14" },
      { en: "15" }
    ],
    correctIndex: 3,
    explanation: { en: "There are 15 prostrations of recitation (Sajdahs) marked throughout the Holy Quran in standard recitation copies." },
    difficulty: "medium"
  },
  {
    id: "quiz_quran_16",
    category: "quran",
    question: { en: "What is the name of the angel responsible for delivering the Quranic revelations?" },
    options: [
      { en: "Angel Mika'il" },
      { en: "Angel Jibril" },
      { en: "Angel Israfil" },
      { en: "Angel Azra'il" }
    ],
    correctIndex: 1,
    explanation: { en: "Angel Jibril (Gabriel) was tasked by Allah with conveying the revelations to Prophet Muhammad (pbuh)." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_17",
    category: "quran",
    question: { en: "Which Surah is recommended to be read every Friday for protection and light?" },
    options: [
      { en: "Al-Mulk" },
      { en: "Al-Kahf" },
      { en: "Al-Waqi'ah" },
      { en: "Al-Fath" }
    ],
    correctIndex: 1,
    explanation: { en: "Reciting Surah Al-Kahf on Fridays provides a light of protection and spiritual guidance from one Friday to the next." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_18",
    category: "quran",
    question: { en: "Who compiled the first complete written volume of the Quran during the Caliphate?" },
    options: [
      { en: "Abu Bakr as-Siddiq" },
      { en: "Umar ibn al-Khattab" },
      { en: "Uthman ibn Affan" },
      { en: "Ali ibn Abi Talib" }
    ],
    correctIndex: 0,
    explanation: { en: "Under the instruction of Caliph Abu Bakr (ra), Zayd ibn Thabit (ra) compiled the first unified copy of the Quran." },
    difficulty: "medium"
  },
  {
    id: "quiz_quran_19",
    category: "quran",
    question: { en: "Which Surah protects against the torment of the grave if read daily?" },
    options: [
      { en: "Ya-Sin" },
      { en: "Al-Mulk" },
      { en: "Ar-Rahman" },
      { en: "Al-Hadid" }
    ],
    correctIndex: 1,
    explanation: { en: "Surah Al-Mulk (The Sovereignty) contains 30 verses that intercede for its reciter until they are forgiven and protected in the grave." },
    difficulty: "easy"
  },
  {
    id: "quiz_quran_20",
    category: "quran",
    question: { en: "What are the two main divisions of Surahs based on the place of revelation?" },
    options: [
      { en: "Makki and Madani" },
      { en: "Eastern and Western" },
      { en: "Early and Late" },
      { en: "High and Low" }
    ],
    correctIndex: 0,
    explanation: { en: "Surahs are classified as Makki (revealed before migration to Madinah) and Madani (revealed after migration)." },
    difficulty: "easy"
  },

  // ── Seerah (20 questions) ──
  {
    id: "quiz_seerah_01",
    category: "seerah",
    question: { en: "In which year was Prophet Muhammad (pbuh) born?" },
    options: [
      { en: "560 CE" },
      { en: "570 CE" },
      { en: "580 CE" },
      { en: "590 CE" }
    ],
    correctIndex: 1,
    explanation: { en: "Prophet Muhammad (pbuh) was born in the year 570 CE, in Makkah, famously known as the 'Year of the Elephant'." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_02",
    category: "seerah",
    question: { en: "What was the name of the Prophet's mother?" },
    options: [
      { en: "Halimah" },
      { en: "Aminah" },
      { en: "Fatimah" },
      { en: "Khadijah" }
    ],
    correctIndex: 1,
    explanation: { en: "Aminah bint Wahb was the mother of Prophet Muhammad (pbuh). She passed away when he was six years old." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_03",
    category: "seerah",
    question: { en: "Who was the first woman to accept Islam?" },
    options: [
      { en: "Aisha bint Abu Bakr" },
      { en: "Khadijah bint Khuwaylid" },
      { en: "Fatimah bint Muhammad" },
      { en: "Sawdah bint Zam'ah" }
    ],
    correctIndex: 1,
    explanation: { en: "Khadijah (ra), the beloved first wife of Prophet Muhammad (pbuh), was the very first person to accept his message and convert to Islam." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_04",
    category: "seerah",
    question: { en: "At what age did Prophet Muhammad (pbuh) receive the first revelation?" },
    options: [
      { en: "25" },
      { en: "30" },
      { en: "35" },
      { en: "40" }
    ],
    correctIndex: 3,
    explanation: { en: "The Prophet (pbuh) was 40 years old when he received the first Quranic revelation in the Cave of Hira." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_05",
    category: "seerah",
    question: { en: "What was the title given to the Prophet (pbuh) in Makkah before his prophethood due to his honesty?" },
    options: [
      { en: "Al-Hakim" },
      { en: "Al-Amin" },
      { en: "Al-Mansur" },
      { en: "Al-Rashid" }
    ],
    correctIndex: 1,
    explanation: { en: "The Makkans called him 'Al-Amin' (The Trustworthy) and 'As-Sadiq' (The Truthful) because of his exemplary honesty and integrity." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_06",
    category: "seerah",
    question: { en: "What is the name of the cave where the first revelation was sent?" },
    options: [
      { en: "Cave of Thawr" },
      { en: "Cave of Hira" },
      { en: "Cave of Kahf" },
      { en: "Cave of Uhud" }
    ],
    correctIndex: 1,
    explanation: { en: "The first revelation was received in the Cave of Hira, located on Jabal al-Nour near Makkah." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_07",
    category: "seerah",
    question: { en: "Which of the Prophet's uncles was a severe opponent of Islam?" },
    options: [
      { en: "Hamzah" },
      { en: "Abu Talib" },
      { en: "Abu Lahab" },
      { en: "Al-Abbas" }
    ],
    correctIndex: 2,
    explanation: { en: "Abu Lahab was one of the Prophet's uncles who rejected his message, actively mocked him, and is condemned in Surah Al-Masad." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_08",
    category: "seerah",
    question: { en: "What was the name of the camel that the Prophet (pbuh) rode during his migration (Hijrah) to Madinah?" },
    options: [
      { en: "Qaswa" },
      { en: "Zuljanah" },
      { en: "Duldul" },
      { en: "Yafur" }
    ],
    correctIndex: 0,
    explanation: { en: "The Prophet's camel was named Al-Qaswa. She carried him during the historic migration and chose the location of his mosque in Madinah." },
    difficulty: "medium"
  },
  {
    id: "quiz_seerah_09",
    category: "seerah",
    question: { en: "What was the first battle fought between the Muslims of Madinah and the Quraysh of Makkah?" },
    options: [
      { en: "Battle of Uhud" },
      { en: "Battle of Badr" },
      { en: "Battle of the Trench" },
      { en: "Battle of Khaybar" }
    ],
    correctIndex: 1,
    explanation: { en: "The Battle of Badr, fought in 2 AH (624 CE), was the first decisive engagement where 313 Muslims defeated a much larger Makkan army." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_10",
    category: "seerah",
    question: { en: "Which companion traveled with the Prophet (pbuh) during the Hijrah migration?" },
    options: [
      { en: "Umar ibn al-Khattab" },
      { en: "Abu Bakr as-Siddiq" },
      { en: "Ali ibn Abi Talib" },
      { en: "Uthman ibn Affan" }
    ],
    correctIndex: 1,
    explanation: { en: "Abu Bakr (ra) was selected by the Prophet (pbuh) as his companion and companion of the cave during the dangerous escape to Madinah." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_11",
    category: "seerah",
    question: { en: "What was the name of the treaty signed between Makkah and Madinah in 6 AH?" },
    options: [
      { en: "Treaty of Madinah" },
      { en: "Treaty of Hudaybiyyah" },
      { en: "Treaty of Taif" },
      { en: "Treaty of Aqabah" }
    ],
    correctIndex: 1,
    explanation: { en: "The Treaty of Hudaybiyyah was a critical 10-year peace treaty that allowed the Muslims of Madinah to perform pilgrimage the following year." },
    difficulty: "medium"
  },
  {
    id: "quiz_seerah_12",
    category: "seerah",
    question: { en: "Which of the Prophet's daughters married Ali ibn Abi Talib?" },
    options: [
      { en: "Ruqayyah" },
      { en: "Zaynab" },
      { en: "Fatimah" },
      { en: "Umm Kulthum" }
    ],
    correctIndex: 2,
    explanation: { en: "Fatimah (ra), the youngest daughter of the Prophet (pbuh), was married to his cousin Ali ibn Abi Talib (ra)." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_13",
    category: "seerah",
    question: { en: "What was the Year of Sorrow (Aam al-Huzn) in the Prophet's life?" },
    options: [
      { en: "Year of his mother's death" },
      { en: "Year both Khadijah and Abu Talib died" },
      { en: "Year of the Battle of Uhud" },
      { en: "Year of the Hijrah" }
    ],
    correctIndex: 1,
    explanation: { en: "The 10th year of prophethood is called the Year of Sorrow because the Prophet (pbuh) lost both his uncle Abu Talib and his beloved wife Khadijah." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_14",
    category: "seerah",
    question: { en: "What is the miraculous night journey of the Prophet (pbuh) from Makkah to Jerusalem and heaven called?" },
    options: [
      { en: "Hijrah" },
      { en: "Isra and Mi'raj" },
      { en: "Ghazwah" },
      { en: "Bay'ah" }
    ],
    correctIndex: 1,
    explanation: { en: "Al-Isra (journey to Jerusalem) and Al-Mi'raj (ascension to the heavens) was a miraculous single-night journey where the five daily prayers were ordained." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_15",
    category: "seerah",
    question: { en: "Who was the Prophet's grandfather who took care of him after his mother's death?" },
    options: [
      { en: "Abu Talib" },
      { en: "Abdul Muttalib" },
      { en: "Hashim" },
      { en: "Abdu Manaf" }
    ],
    correctIndex: 1,
    explanation: { en: "Abdul Muttalib, the chief of the Quraysh tribe, cared for the young Prophet (pbuh) until his own death, when the Prophet was eight." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_16",
    category: "seerah",
    question: { en: "What was the name of the Christian king of Abyssinia (Ethiopia) who sheltered the first Muslim refugees?" },
    options: [
      { en: "Heraclius" },
      { en: "Negus (Najashi)" },
      { en: "Chosroes" },
      { en: "Muqawqis" }
    ],
    correctIndex: 1,
    explanation: { en: "Negus (Al-Najashi) was a just Christian king who gave asylum to early Muslim immigrants fleeing Makkan persecution." },
    difficulty: "medium"
  },
  {
    id: "quiz_seerah_17",
    category: "seerah",
    question: { en: "Who was the wet-nurse who fostered the Prophet (pbuh) in the desert during his infancy?" },
    options: [
      { en: "Thuwaybah" },
      { en: "Halimah as-Sa'diyyah" },
      { en: "Umm Ayman" },
      { en: "Aminah" }
    ],
    correctIndex: 1,
    explanation: { en: "Halimah (ra) from the tribe of Banu Sa'd raised the infant Prophet (pbuh) in the clean desert air as was Custom." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_18",
    category: "seerah",
    question: { en: "In which Islamic year did the Conquest of Makkah take place?" },
    options: [
      { en: "6 AH" },
      { en: "8 AH" },
      { en: "10 AH" },
      { en: "11 AH" }
    ],
    correctIndex: 1,
    explanation: { en: "The peaceful Conquest of Makkah took place in Ramadan of 8 AH (630 CE), leading to the cleaning of idols from the Kaaba." },
    difficulty: "medium"
  },
  {
    id: "quiz_seerah_19",
    category: "seerah",
    question: { en: "Where did the Prophet (pbuh) deliver his famous Farewell Sermon (Khutbah al-Wada)?" },
    options: [
      { en: "Masjid al-Haram" },
      { en: "Masjid an-Nabawi" },
      { en: "Mount Arafat" },
      { en: "Mina" }
    ],
    correctIndex: 2,
    explanation: { en: "The Prophet (pbuh) delivered his historic Farewell Sermon on Mount Arafat (Jabal al-Rahmah) during his final Hajj in 10 AH." },
    difficulty: "easy"
  },
  {
    id: "quiz_seerah_20",
    category: "seerah",
    question: { en: "Where is Prophet Muhammad (pbuh) buried?" },
    options: [
      { en: "Makkah" },
      { en: "Jerusalem" },
      { en: "Madinah" },
      { en: "Taif" }
    ],
    correctIndex: 2,
    explanation: { en: "The Prophet (pbuh) passed away in the apartment of his wife Aisha (ra) in Madinah and is buried there, beneath the Green Dome of Masjid an-Nabawi." },
    difficulty: "easy"
  },

  // ── Fiqh (20 questions) ──
  {
    id: "quiz_fiqh_01",
    category: "fiqh",
    question: { en: "How many times a day is a Muslim obligated to perform standard prayers (Salah)?" },
    options: [
      { en: "3" },
      { en: "4" },
      { en: "5" },
      { en: "6" }
    ],
    correctIndex: 2,
    explanation: { en: "The five daily obligatory prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) are a pillar of Islam." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_02",
    category: "fiqh",
    question: { en: "What is the Arabic word for the dry purification performed with clean earth when water is unavailable?" },
    options: [
      { en: "Wudu" },
      { en: "Ghusl" },
      { en: "Tayammum" },
      { en: "Istinja" }
    ],
    correctIndex: 2,
    explanation: { en: "Tayammum is the clean sand or dust purification permitted when water is scarce, unsafe, or unavailable." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_03",
    category: "fiqh",
    question: { en: "Which prayer does not have any Sunnah or voluntary prayers immediately following it?" },
    options: [
      { en: "Dhuhr" },
      { en: "Maghrib" },
      { en: "Isha" },
      { en: "Asr" }
    ],
    correctIndex: 3,
    explanation: { en: "According to standard Fiqh, there is a general prohibition on performing voluntary prayers immediately after the Asr prayer until sunset." },
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_04",
    category: "fiqh",
    question: { en: "What is the minimum percentage of accumulated wealth that must be given as Zakat annually?" },
    options: [
      { en: "1.5%" },
      { en: "2.5%" },
      { en: "5.0%" },
      { en: "10.0%" }
    ],
    correctIndex: 1,
    explanation: { en: "Zakat is calculated as 2.5% of a Muslim's qualifying surplus wealth (beyond the Nisab threshold) held for a full lunar year." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_05",
    category: "fiqh",
    question: { en: "What is the threshold of wealth that makes Zakat obligatory called in Fiqh?" },
    options: [
      { en: "Nisab" },
      { en: "Sadaqah" },
      { en: "Fard" },
      { en: "Halal" }
    ],
    correctIndex: 0,
    explanation: { en: "Nisab is the minimum amount of wealth or assets a Muslim must possess before they are obligated to pay Zakat." },
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_06",
    category: "fiqh",
    question: { en: "Which action invalidates an active fast (Sawm)?" },
    options: [
      { en: "Using the siwak (toothbrush)" },
      { en: "Deliberately eating or drinking" },
      { en: "Swallowing one's saliva" },
      { en: "Taking a shower" }
    ],
    correctIndex: 1,
    explanation: { en: "Deliberately eating or drinking during the hours of daylight immediately breaks and invalidates the fast." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_07",
    category: "fiqh",
    question: { en: "What is the name of the voluntary prayer performed in congregation during the nights of Ramadan?" },
    options: [
      { en: "Tahajjud" },
      { en: "Tarawih" },
      { en: "Witr" },
      { en: "Duha" }
    ],
    correctIndex: 1,
    explanation: { en: "Tarawih is a highly recommended congregational prayer performed after the Isha prayer during the month of Ramadan." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_08",
    category: "fiqh",
    question: { en: "What is the direction of the Qibla that Muslims face during prayer?" },
    options: [
      { en: "Towards Jerusalem" },
      { en: "Towards the East" },
      { en: "Towards the Kaaba in Makkah" },
      { en: "Towards the sun" }
    ],
    correctIndex: 2,
    explanation: { en: "Muslims are obligated to face the direction of the Kaaba in Makkah during their prayers." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_09",
    category: "fiqh",
    question: { en: "Which posture is the act of bowing down in prayer called?" },
    options: [
      { en: "Ruku" },
      { en: "Sajdah" },
      { en: "Qiyam" },
      { en: "Tashahhud" }
    ],
    correctIndex: 0,
    explanation: { en: "Ruku is the bowing position in prayer, keeping the back straight and hands on the knees." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_10",
    category: "fiqh",
    question: { en: "What is the ruling (hukm) of performing Hajj once in a lifetime for a capable Muslim?" },
    options: [
      { en: "Sunnah (Recommended)" },
      { en: "Fard (Obligatory)" },
      { en: "Mustahabb (Liked)" },
      { en: "Mubah (Permissible)" }
    ],
    correctIndex: 1,
    explanation: { en: "Hajj is one of the five pillars of Islam and is Fard (obligatory) once in a lifetime for those physically and financially able." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_11",
    category: "fiqh",
    question: { en: "How many units (Rak'ahs) are in the Fajr obligatory prayer?" },
    options: [
      { en: "2" },
      { en: "3" },
      { en: "4" },
      { en: "5" }
    ],
    correctIndex: 0,
    explanation: { en: "The Fajr obligatory prayer (Fard) consists of exactly 2 Rak'ahs." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_12",
    category: "fiqh",
    question: { en: "Which of the following breaks your Wudu (ablution)?" },
    options: [
      { en: "Drinking water" },
      { en: "Passing gas or using the restroom" },
      { en: "Smiling" },
      { en: "Cutting your nails" }
    ],
    correctIndex: 1,
    explanation: { en: "Using the restroom, passing gas, deep sleep, and loss of consciousness are actions that invalidate Wudu." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_13",
    category: "fiqh",
    question: { en: "Which prayer is shortened (Qasr) by a traveler?" },
    options: [
      { en: "Maghrib" },
      { en: "Fajr" },
      { en: "Dhuhr, Asr, and Isha" },
      { en: "All prayers" }
    ],
    correctIndex: 2,
    explanation: { en: "A traveler is permitted to shorten the 4-Rak'ah prayers (Dhuhr, Asr, Isha) to 2 Rak'ahs." },
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_14",
    category: "fiqh",
    question: { en: "What is the name of the voluntary prayer performed mid-morning?" },
    options: [
      { en: "Witr" },
      { en: "Duha" },
      { en: "Tarawih" },
      { en: "Tahajjud" }
    ],
    correctIndex: 1,
    explanation: { en: "Duha is a highly recommended voluntary prayer performed between sunrise and Dhuhr." },
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_15",
    category: "fiqh",
    question: { en: "What is the legal ruling for eating pork in Islam?" },
    options: [
      { en: "Makruh (Disliked)" },
      { en: "Haram (Forbidden)" },
      { en: "Halal (Permitted)" },
      { en: "Mustahabb" }
    ],
    correctIndex: 1,
    explanation: { en: "Pork is strictly classified as Haram (forbidden) in the Quran." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_16",
    category: "fiqh",
    question: { en: "Which water is considered pure and usable for Wudu?" },
    options: [
      { en: "Flowing river or rainwater" },
      { en: "Water mixed with soap" },
      { en: "Fruit juice" },
      { en: "Stagnant, colored water" }
    ],
    correctIndex: 0,
    explanation: { en: "Natural waters (rain, rivers, seas, wells) that retain their natural color, taste, and smell are pure and suitable for ablution." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_17",
    category: "fiqh",
    question: { en: "What is the name of the sermon delivered during the Friday congregational prayer?" },
    options: [
      { en: "Hadith" },
      { en: "Khutbah" },
      { en: "Dua" },
      { en: "Dars" }
    ],
    correctIndex: 1,
    explanation: { en: "The Khutbah is the sermon delivered by the Imam before the Friday congregational (Jumu'ah) prayer." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_18",
    category: "fiqh",
    question: { en: "What are the two components of the testimony of faith (Shahadah)?" },
    options: [
      { en: "Belief in Allah and Angels" },
      { en: "Belief in Allah's Oneness and Muhammad's Prophethood" },
      { en: "Prayer and Fasting" },
      { en: "Charity and Hajj" }
    ],
    correctIndex: 1,
    explanation: { en: "The Shahadah asserts that there is no deity worthy of worship except Allah, and Muhammad is His messenger." },
    difficulty: "easy"
  },
  {
    id: "quiz_fiqh_19",
    category: "fiqh",
    question: { en: "What is the required charity distributed to the poor at the end of Ramadan before Eid prayer?" },
    options: [
      { en: "Zakat al-Mal" },
      { en: "Zakat al-Fitr" },
      { en: "Sadaqah Jariyah" },
      { en: "Waqf" }
    ],
    correctIndex: 1,
    explanation: { en: "Zakat al-Fitr is an obligatory food charity given before the Eid al-Fitr prayer so the poor can also celebrate." },
    difficulty: "medium"
  },
  {
    id: "quiz_fiqh_20",
    category: "fiqh",
    question: { en: "What is the term for the compensatory prostrations made at the end of prayer due to a mistake or omission?" },
    options: [
      { en: "Sajdah ash-Shukr" },
      { en: "Sajdah as-Sahw" },
      { en: "Sajdah al-Tilawah" },
      { en: "Ruku" }
    ],
    correctIndex: 1,
    explanation: { en: "Sajdah as-Sahw (prostrations of forgetfulness) are two prostrations performed at the end of prayer to correct mistakes or omissions." },
    difficulty: "medium"
  },

  // ── History (20 questions) ──
  {
    id: "quiz_history_01",
    category: "history",
    question: { en: "Who was the first Caliph of Islam after the death of the Prophet (pbuh)?" },
    options: [
      { en: "Umar ibn al-Khattab" },
      { en: "Ali ibn Abi Talib" },
      { en: "Abu Bakr as-Siddiq" },
      { en: "Uthman ibn Affan" }
    ],
    correctIndex: 2,
    explanation: { en: "Abu Bakr (ra) was elected as the first Rightly Guided Caliph (Khalifah) and ruled from 11-13 AH." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_02",
    category: "history",
    question: { en: "Who was the second Caliph, known as 'Al-Faruq' (The Distinguisher of Truth)?" },
    options: [
      { en: "Abu Bakr" },
      { en: "Umar ibn al-Khattab" },
      { en: "Uthman ibn Affan" },
      { en: "Ali ibn Abi Talib" }
    ],
    correctIndex: 1,
    explanation: { en: "Umar ibn al-Khattab (ra) was the second Caliph, renowned for his justice, administrative reforms, and rapid expansion." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_03",
    category: "history",
    question: { en: "During which Caliph's reign was the official standardized text of the Quran compiled and sent to major cities?" },
    options: [
      { en: "Abu Bakr" },
      { en: "Umar" },
      { en: "Uthman ibn Affan" },
      { en: "Ali" }
    ],
    correctIndex: 2,
    explanation: { en: "Uthman ibn Affan (ra), the third Caliph, organized the standardization of the Quran's pronunciation and script to preserve it." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_04",
    category: "history",
    question: { en: "Who was the fourth Caliph of Islam, who was also the cousin and son-in-law of the Prophet (pbuh)?" },
    options: [
      { en: "Abu Bakr" },
      { en: "Umar" },
      { en: "Uthman" },
      { en: "Ali ibn Abi Talib" }
    ],
    correctIndex: 3,
    explanation: { en: "Ali ibn Abi Talib (ra) was the fourth and final of the Rightly Guided Caliphs (Khulafa-e-Rashidun)." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_05",
    category: "history",
    question: { en: "What is the collective name given to the first four Caliphs of Islam?" },
    options: [
      { en: "Umayyads" },
      { en: "Abbasids" },
      { en: "Rashidun Caliphs" },
      { en: "Ottomans" }
    ],
    correctIndex: 2,
    explanation: { en: "They are known as the Khulafa-e-Rashidun, meaning the Rightly Guided Caliphs." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_06",
    category: "history",
    question: { en: "What was the capital of the Umayyad Caliphate?" },
    options: [
      { en: "Madinah" },
      { en: "Baghdad" },
      { en: "Damascus" },
      { en: "Cairo" }
    ],
    correctIndex: 2,
    explanation: { en: "The Umayyad Caliphate (661-750 CE) established Damascus in Syria as its capital." },
    difficulty: "medium"
  },
  {
    id: "quiz_history_07",
    category: "history",
    question: { en: "Which Caliphate is famously known for the 'Islamic Golden Age', centered in Baghdad?" },
    options: [
      { en: "Umayyad Caliphate" },
      { en: "Abbasid Caliphate" },
      { en: "Fatimid Caliphate" },
      { en: "Ottoman Caliphate" }
    ],
    correctIndex: 1,
    explanation: { en: "The Abbasid Caliphate (750-1258 CE) presided over the Islamic Golden Age, promoting science, philosophy, and translation." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_08",
    category: "history",
    question: { en: "What was the name of the famous library and intellectual academy in Baghdad during the Abbasid Golden Age?" },
    options: [
      { en: "House of Wisdom (Bayt al-Hikmah)" },
      { en: "Library of Alexandria" },
      { en: "Al-Azhar" },
      { en: "Al-Qarawiyyin" }
    ],
    correctIndex: 0,
    explanation: { en: "Bayt al-Hikmah (House of Wisdom) was a major intellectual hub where scholars translated and advanced global scientific texts." },
    difficulty: "medium"
  },
  {
    id: "quiz_history_09",
    category: "history",
    question: { en: "Which Muslim general liberated Jerusalem from Crusader rule in 1187 CE after the Battle of Hattin?" },
    options: [
      { en: "Khalid ibn al-Walid" },
      { en: "Salahuddin al-Ayyubi (Saladin)" },
      { en: "Tariq ibn Ziyad" },
      { en: "Muhammad bin Qasim" }
    ],
    correctIndex: 1,
    explanation: { en: "Salahuddin al-Ayyubi (Saladin) successfully recaptured Jerusalem and was highly respected for his chivalry and justice." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_10",
    category: "history",
    question: { en: "Who was the Muslim commander who led the conquest of Hispania (Spain) in 711 CE, naming Gibraltar after himself?" },
    options: [
      { en: "Tariq ibn Ziyad" },
      { en: "Uqbah bin Nafi" },
      { en: "Musa bin Nusayr" },
      { en: "Qutaybah bin Muslim" }
    ],
    correctIndex: 0,
    explanation: { en: "Tariq ibn Ziyad landed at Gibraltar (Jabal Tariq, meaning Mount of Tariq) and initiated the Islamic history of Al-Andalus." },
    difficulty: "medium"
  },
  {
    id: "quiz_history_11",
    category: "history",
    question: { en: "What was the name of the Islamic kingdom in Spain that became a center of European culture and learning?" },
    options: [
      { en: "Al-Andalus" },
      { en: "Sicily" },
      { en: "Ottoman Empire" },
      { en: "Safavid Empire" }
    ],
    correctIndex: 0,
    explanation: { en: "Al-Andalus (711-1492 CE) was a beacon of tolerance, art, philosophy, and advanced technology in Medieval Europe." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_12",
    category: "history",
    question: { en: "Which university, founded in Fez (Morocco) in 859 CE by Fatima al-Fihri, is the oldest continuously operating university?" },
    options: [
      { en: "Al-Azhar University" },
      { en: "University of Al-Qarawiyyin" },
      { en: "Nizamiyyah" },
      { en: "Sankore University" }
    ],
    correctIndex: 1,
    explanation: { en: "The University of Al-Qarawiyyin, founded by a wealthy Muslim woman named Fatima al-Fihri, is recognized by UNESCO." },
    difficulty: "medium"
  },
  {
    id: "quiz_history_13",
    category: "history",
    question: { en: "Which Caliph, often referred to as the 'Fifth Rightly Guided Caliph' due to his intense piety and reforms?" },
    options: [
      { en: "Muawiyah I" },
      { en: "Umar ibn Abdul Aziz" },
      { en: "Harun al-Rashid" },
      { en: "Al-Mamun" }
    ],
    correctIndex: 1,
    explanation: { en: "Umar ibn Abdul Aziz (Umar II) of the Umayyad dynasty is celebrated for restoring justice and implementing public reforms." },
    difficulty: "medium"
  },
  {
    id: "quiz_history_14",
    category: "history",
    question: { en: "Which empire captured Constantinople in 1453 CE under the leadership of Sultan Mehmed II?" },
    options: [
      { en: "Abbasid Empire" },
      { en: "Seljuk Empire" },
      { en: "Ottoman Empire" },
      { en: "Mughal Empire" }
    ],
    correctIndex: 2,
    explanation: { en: "Sultan Mehmed II (Mehmed the Conqueror) led the Ottomans in capturing Constantinople, ending the Byzantine Empire." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_15",
    category: "history",
    question: { en: "Who was the legendary Muslim traveler and scholar who traversed over 73,000 miles across Africa, Asia, and Europe?" },
    options: [
      { en: "Ibn Battuta" },
      { en: "Ibn Khaldun" },
      { en: "Al-Khwarizmi" },
      { en: "Ibn Sina" }
    ],
    correctIndex: 0,
    explanation: { en: "Ibn Battuta (1304-1369 CE) is considered one of the greatest travelers in history, documenting his journeys in the Rihla." },
    difficulty: "medium"
  },
  {
    id: "quiz_history_16",
    category: "history",
    question: { en: "Which dynasty built the Taj Mahal in Agra, India?" },
    options: [
      { en: "Ghaznavid Dynasty" },
      { en: "Delhi Sultanate" },
      { en: "Mughal Empire" },
      { en: "Ottoman Empire" }
    ],
    correctIndex: 2,
    explanation: { en: "The Mughal Emperor Shah Jahan constructed the Taj Mahal in the 17th century as a mausoleum for his beloved wife." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_17",
    category: "history",
    question: { en: "Who is known as the father of modern Algebra, whose name gave rise to the term 'algorithm'?" },
    options: [
      { en: "Al-Biruni" },
      { en: "Al-Khwarizmi" },
      { en: "Ibn al-Haytham" },
      { en: "Jabir ibn Hayyan" }
    ],
    correctIndex: 1,
    explanation: { en: "Muhammad ibn Musa al-Khwarizmi wrote 'Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala', originating the term Algebra." },
    difficulty: "medium"
  },
  {
    id: "quiz_history_18",
    category: "history",
    question: { en: "Which city was destroyed by the Mongols in 1258 CE, marking the tragic end of the Abbasid Golden Age?" },
    options: [
      { en: "Damascus" },
      { en: "Cairo" },
      { en: "Baghdad" },
      { en: "Cordoba" }
    ],
    correctIndex: 2,
    explanation: { en: "The Mongol army led by Hulagu Khan sacked Baghdad in 1258 CE, destroying libraries, architectural wonders, and ending the Caliphate." },
    difficulty: "easy"
  },
  {
    id: "quiz_history_19",
    category: "history",
    question: { en: "Which Caliphate established the great library and mosque city of Cordoba in Spain?" },
    options: [
      { en: "Fatimid Caliphate" },
      { en: "Abbasid Caliphate" },
      { en: "Umayyad Caliphate of Cordoba" },
      { en: "Almohad Caliphate" }
    ],
    correctIndex: 2,
    explanation: { en: "The Umayyad Emirate/Caliphate of Cordoba, founded by Abd al-Rahman I, built Cordoba into the most advanced city in Europe." },
    difficulty: "medium"
  },
  {
    id: "quiz_history_20",
    category: "history",
    question: { en: "Who was the famous Muslim sociologist and historian who wrote the 'Muqaddimah'?" },
    options: [
      { en: "Ibn Khaldun" },
      { en: "Ibn Rushd" },
      { en: "Al-Farabi" },
      { en: "Ibn Hazm" }
    ],
    correctIndex: 0,
    explanation: { en: "Ibn Khaldun (1332-1406 CE) wrote the Muqaddimah (Introduction), establishing the foundations of modern sociology and historiography." },
    difficulty: "medium"
  },

  // ── General Knowledge (20 questions) ──
  {
    id: "quiz_general_01",
    category: "general",
    question: { en: "What are the five core pillars of Islam?" },
    options: [
      { en: "Faith, Prayer, Charity, Fasting, Pilgrimage" },
      { en: "Jihad, Hijrah, Dhikr, Knowledge, Kindness" },
      { en: "Wudu, Adhan, Quran, Mosque, Eid" },
      { en: "Justice, Equality, Peace, Love, Sincerity" }
    ],
    correctIndex: 0,
    explanation: { en: "The five pillars of Islam are: Shahadah (Faith), Salah (Prayer), Zakat (Charity), Sawm (Fasting), and Hajj (Pilgrimage)." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_02",
    category: "general",
    question: { en: "What is the Islamic calendar called?" },
    options: [
      { en: "Lunar Calendar" },
      { en: "Gregorian Calendar" },
      { en: "Hijri Calendar" },
      { en: "Solar Calendar" }
    ],
    correctIndex: 2,
    explanation: { en: "The Islamic calendar is the Hijri Calendar, based on the lunar cycle, starting from the year of the migration (Hijrah) of the Prophet." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_03",
    category: "general",
    question: { en: "How many months are in the Hijri calendar?" },
    options: [
      { en: "10" },
      { en: "11" },
      { en: "12" },
      { en: "13" }
    ],
    correctIndex: 2,
    explanation: { en: "Like the Gregorian calendar, the Hijri calendar has exactly 12 months, though they are lunar and vary between 29 and 30 days." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_04",
    category: "general",
    question: { en: "What is the first month of the Islamic Hijri year?" },
    options: [
      { en: "Ramadan" },
      { en: "Shawwal" },
      { en: "Muharram" },
      { en: "Dhul-Hijjah" }
    ],
    correctIndex: 2,
    explanation: { en: "Muharram is the first month of the Islamic Hijri calendar, representing a time of reflection." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_05",
    category: "general",
    question: { en: "What is the holiest sanctuary in Islam, located in Makkah?" },
    options: [
      { en: "Masjid an-Nabawi" },
      { en: "Masjid al-Aqsa" },
      { en: "Masjid al-Haram (The Sacred Mosque)" },
      { en: "Masjid Quba" }
    ],
    correctIndex: 2,
    explanation: { en: "Masjid al-Haram, containing the Kaaba in Makkah, is the holiest mosque and sanctuary in Islam." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_06",
    category: "general",
    question: { en: "What is the second holiest mosque in Islam, located in Madinah?" },
    options: [
      { en: "Masjid al-Aqsa" },
      { en: "Masjid an-Nabawi (The Prophet's Mosque)" },
      { en: "Masjid Quba" },
      { en: "Masjid al-Kiblatayn" }
    ],
    correctIndex: 1,
    explanation: { en: "Masjid an-Nabawi (The Prophet's Mosque) in Madinah is the second holiest sanctuary in Islam." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_07",
    category: "general",
    question: { en: "What is the third holiest mosque in Islam, located in Jerusalem?" },
    options: [
      { en: "Masjid al-Aqsa" },
      { en: "Dome of the Rock" },
      { en: "Masjid al-Haram" },
      { en: "Masjid al-Qiblatayn" }
    ],
    correctIndex: 0,
    explanation: { en: "Masjid al-Aqsa in Jerusalem is the third holiest sanctuary and was the first Qibla of Islam before the Kaaba." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_08",
    category: "general",
    question: { en: "What is the primary language of the Quran and Islamic scholarly texts?" },
    options: [
      { en: "Persian" },
      { en: "Turkish" },
      { en: "Arabic" },
      { en: "Urdu" }
    ],
    correctIndex: 2,
    explanation: { en: "Classical Arabic is the language of the Holy Quran, which has preserved it for over 1,400 years." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_09",
    category: "general",
    question: { en: "What are the two major festivals celebrated by Muslims worldwide?" },
    options: [
      { en: "Eid al-Fitr and Eid al-Adha" },
      { en: "Mawlid and Shab-e-Barat" },
      { en: "Muharram and Ashura" },
      { en: "Ramadan and Laylat al-Qadr" }
    ],
    correctIndex: 0,
    explanation: { en: "Eid al-Fitr (celebrating the end of Ramadan) and Eid al-Adha (celebrating Hajj and Ibrahim's sacrifice) are the two major celebrations." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_10",
    category: "general",
    question: { en: "What does the word 'Islam' literally mean in Arabic?" },
    options: [
      { en: "Faith" },
      { en: "Submission / Peace" },
      { en: "Wisdom" },
      { en: "Struggle" }
    ],
    correctIndex: 1,
    explanation: { en: "Islam is derived from the root 's-l-m', which means peace, safety, and submission to the will of Allah." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_11",
    category: "general",
    question: { en: "What is the name of the sacred spring of water located inside the Masjid al-Haram?" },
    options: [
      { en: "Spring of Quba" },
      { en: "Well of Zamzam" },
      { en: "Salsabil" },
      { en: "Kauthar" }
    ],
    correctIndex: 1,
    explanation: { en: "Zamzam is a miraculously flowing water source provided by Allah to Hajar and her infant son Ishmael." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_12",
    category: "general",
    question: { en: "What is the name of the first mosque built in Islamic history, located near Madinah?" },
    options: [
      { en: "Masjid an-Nabawi" },
      { en: "Masjid al-Aqsa" },
      { en: "Masjid Quba" },
      { en: "Masjid al-Kiblatayn" }
    ],
    correctIndex: 2,
    explanation: { en: "Masjid Quba was the first mosque constructed by Prophet Muhammad (pbuh) and his companions upon arriving in Madinah." },
    difficulty: "medium"
  },
  {
    id: "quiz_general_13",
    category: "general",
    question: { en: "How many articles of faith (Iman) are in Islam?" },
    options: [
      { en: "5" },
      { en: "6" },
      { en: "7" },
      { en: "8" }
    ],
    correctIndex: 1,
    explanation: { en: "There are six articles of faith: Belief in Allah, His Angels, His Books, His Messengers, the Day of Judgment, and Divine Decree (Qadr)." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_14",
    category: "general",
    question: { en: "Which month of the Hijri calendar is dedicated to daily obligatory fasting?" },
    options: [
      { en: "Rajab" },
      { en: "Sha'ban" },
      { en: "Ramadan" },
      { en: "Shawwal" }
    ],
    correctIndex: 2,
    explanation: { en: "Ramadan, the 9th month of the Hijri calendar, is the month of mercy and obligatory fasting." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_15",
    category: "general",
    question: { en: "In which Hijri month is the annual pilgrimage (Hajj) performed?" },
    options: [
      { en: "Ramadan" },
      { en: "Muharram" },
      { en: "Dhul-Hijjah" },
      { en: "Shawwal" }
    ],
    correctIndex: 2,
    explanation: { en: "The rites of Hajj are performed between the 8th and 12th days of Dhul-Hijjah, the 12th and final month of the Islamic year." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_16",
    category: "general",
    question: { en: "What is the name of the night in Ramadan that is better than a thousand months?" },
    options: [
      { en: "Laylat al-Qadr (Night of Decree)" },
      { en: "Laylat al-Bara'ah" },
      { en: "Isra and Mi'raj" },
      { en: "Shab-e-Qadr" }
    ],
    correctIndex: 0,
    explanation: { en: "Laylat al-Qadr (Surah Al-Qadr) is the most sacred night in the year, better than 1,000 months of standard worship." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_17",
    category: "general",
    question: { en: "What is the name of the call to prayer announced by the Mu'adhdhin?" },
    options: [
      { en: "Iqamah" },
      { en: "Adhan" },
      { en: "Khutbah" },
      { en: "Dua" }
    ],
    correctIndex: 1,
    explanation: { en: "The Adhan is the public call to prayer recited at the beginning of each salah window." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_18",
    category: "general",
    question: { en: "Who was the first designated Mu'adhdhin (caller to prayer) in Islam, chosen for his beautiful voice?" },
    options: [
      { en: "Zayd bin Harithah" },
      { en: "Bilal ibn Rabah" },
      { en: "Abdullah ibn Umar" },
      { en: "Abu Hurairah" }
    ],
    correctIndex: 1,
    explanation: { en: "Bilal ibn Rabah (ra), an African companion known for his loyalty and beautiful voice, was chosen by the Prophet (pbuh) as the first Mu'adhdhin." },
    difficulty: "easy"
  },
  {
    id: "quiz_general_19",
    category: "general",
    question: { en: "Which city is the burial place of the early Caliphs and thousands of companions, located next to the Prophet's Mosque?" },
    options: [
      { en: "Jannat al-Mu'alla" },
      { en: "Jannat al-Baqi" },
      { en: "Wadi-us-Salaam" },
      { en: "Arafat" }
    ],
    correctIndex: 1,
    explanation: { en: "Jannat al-Baqi (Garden of Baqi) in Madinah is the primary cemetery where many of the Prophet's family and companions rest." },
    difficulty: "medium"
  },
  {
    id: "quiz_general_20",
    category: "general",
    question: { en: "What does the Arabic phrase 'JazakAllahu Khayran' mean?" },
    options: [
      { en: "May Allah reward you with goodness" },
      { en: "Thank you very much" },
      { en: "Peace be upon you" },
      { en: "May Allah forgive you" }
    ],
    correctIndex: 0,
    explanation: { en: "JazakAllahu Khayran is a sunnah expression of gratitude meaning 'May Allah reward you with goodness'." },
    difficulty: "easy"
  }
];
