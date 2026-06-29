export interface Chapter {
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: "magic" | "spiritual" | "korean" | "history" | "science" | "shadows" | "deaths";
  description: string;
  price: number; // USD
  priceNGN: number; // NGN
  coverImage: string;
  chapters: Chapter[];
}

export const booksData: Book[] = [
  {
    id: "kybalion",
    title: "The Kybalion",
    author: "Three Initiates",
    category: "spiritual",
    description: "A study of the Hermetic Philosophy of Ancient Egypt and Greece. It outlines the seven sacred principles of reality, including Mentalism, Correspondence, Vibration, and Polarity.",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: Hermetic Philosophy",
        content: "The teachings of Hermeticism are found in all lands and all religions, but never identified with any particular sect. This is because the ancient teachers warned against allowing the secret doctrine to become crystallized into a creed. The secret wisdom was always kept in the hands of a few select initiates who passed them orally from ear to ear.\n\nThere has always been a Hermetic Master in every age, keeping alive the sacred flame. The Principles of Truth are Seven; he who knows these, understandingly, possesses the Magic Key before whose touch all the Doors of the Temple fly open."
      },
      {
        title: "Chapter II: The Seven Hermetic Principles",
        content: "The Principles of Truth are sevenfold:\n\n1. The Principle of Mentalism: 'THE ALL is MIND; The Universe is Mental.' Everything that exists is a mental creation of the Absolute.\n\n2. The Principle of Correspondence: 'As above, so below; as below, so above.' There is a harmony and agreement between the planes of the outer and inner world.\n\n3. The Principle of Vibration: 'Nothing rests; everything moves; everything vibrates.' Modern science confirms that all matter is in motion.\n\n4. The Principle of Polarity: 'Everything is Dual; everything has poles; everything has its pair of opposites.'\n\n5. The Principle of Rhythm: 'Everything flows, out and in; everything has its tides; all things rise and fall.'\n\n6. The Principle of Cause and Effect: 'Every Cause has its Effect; every Effect has its Cause; everything happens according to Law.'\n\n7. The Principle of Gender: 'Gender is in everything; everything has its Masculine and Feminine Principles.'"
      },
      {
        title: "Chapter III: Mental Transmutation",
        content: "Mind, as well as metals and elements, may be transmuted, from state to state; degree to degree; condition to condition; pole to pole; vibration to vibration. True Hermetic Transmutation is a Mental Art.\n\nTo change your state of mind is to change your vibration. By focusing on the opposite pole of an undesirable emotion, you can raise your mental state into harmony."
      },
      {
        title: "Chapter IV: The All in All",
        content: "While All is in THE ALL, it is equally true that THE ALL is in All. To him who truly understands this truth hath come great knowledge. The Absolute represents the supreme reality from which all things emanate, and in which we live, move, and have our being."
      },
      {
        title: "Chapter V: The Hermetic Axioms",
        content: "The master says: 'To change your circumstances, change your thoughts.' This is the supreme law of transmutation. Let the disciple meditate upon the axioms of the Kybalion to unlock the cosmic seal of destiny."
      }
    ]
  },
  {
    id: "lesser-key-solomon",
    title: "The Lesser Key of Solomon",
    author: "S.L. MacGregor Mathers",
    category: "magic",
    description: "A 17th-century grimoire containing detailed descriptions of spirits, their sigils, and ceremonial rituals to summon and command them. Highly influential in Western occult traditions.",
    price: 18.00,
    priceNGN: 27000,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Goetia",
        content: "The Goetia contains the names, sigils, and characters of the 72 spirits commanded by King Solomon. These spirits are said to govern various realms of human knowledge, secret arts, and physical treasures.\n\nBefore undertaking any ritual, the practitioner must prepare a consecrated circle of protection. The circle represents the micro-cosmos, aligned with the divine light, shielding the magician from any unbalanced astral force."
      },
      {
        title: "Chapter II: The Magical Circle and Triangle",
        content: "The Circle must be drawn exactly nine feet in diameter, with holy names written along its border. To the East of the Circle, the Triangle of Art is placed. It is within this Triangle that the spirits are commanded to manifest.\n\nThe ritual tools—including the magic wand, the sword, the vestments, and the metallic sigil of the spirit—must be pure and free from blemish, consecrated with divine intent."
      },
      {
        title: "Chapter III: The Evocation of Spirits",
        content: "Summoning requires absolute mental clarity and concentration. The magician recites the ancient invocations, demanding the spirit to appear in a pleasant, human form and speak truthfully.\n\n'I conjure thee, O Spirit, by the power of the living God, to show thyself before this circle, to answer my requests, and to depart in peace when thy duty is fulfilled.'"
      },
      {
        title: "Chapter IV: The Seals and Sigils of Command",
        content: "Each of the seventy-two spirits holds a unique seal that must be engraved on a specific metal—such as gold, silver, copper, or lead—corresponding to the planetary alignment of the entity. The seal is the vital link between the magician's consciousness and the spirit's sphere of power."
      },
      {
        title: "Chapter V: The License to Depart",
        content: "Once the work is complete, the spirit must be released with courtesy and absolute authority: 'O Spirit, because thou hast diligently answered my demands, depart now unto thy proper place, bringing no harm or terror to any living soul.'"
      }
    ]
  },
  {
    id: "abramelin-mage",
    title: "The Sacred Magic of Abramelin",
    author: "Abraham of Worms",
    category: "magic",
    description: "The core system of Abramelin involves a strict 6-month purificatory ritual to attain the Knowledge and Conversation of one's Holy Guardian Angel, followed by the binding of demonic forces.",
    price: 20.00,
    priceNGN: 30000,
    coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Preparation of the Rite",
        content: "This sacred operation requires a retreat from the mundane world. For six months, the initiate must maintain a life of prayer, cleanliness, and strict focus. Every morning and evening, one must enter the sacred oratory, seeking the divine essence.\n\nThe room must be adorned with pure white linen, and the altar must hold the holy oil of anointing and sweet incense of galbanum and myrrh."
      },
      {
        title: "Chapter II: The Holy Guardian Angel",
        content: "Upon the completion of the six months of intense devotion, the initiate is granted the ultimate reward: the Knowledge and Conversation of the Holy Guardian Angel.\n\nThis Angel is the divine spark within, the spiritual guide who reveals the mysteries of creation and grants the initiate the authority to command the lower spirits of the Earth safely."
      },
      {
        title: "Chapter III: The Magical Word Squares",
        content: "With the authority of the Holy Guardian Angel, the magician is presented with magic word squares. These squares contain letters that, when arranged properly, hold the power to influence nature, uncover hidden treasures, heal diseases, and command the astral forces."
      },
      {
        title: "Chapter IV: Consecration of the Altar",
        content: "The altar is the spiritual axis of the temple. Constructed of fine cedar wood and crowned with gold, it represents the unbroken covenant between the practitioner and the celestial hierarchy."
      },
      {
        title: "Chapter V: Banishing the Shadow",
        content: "Using the sacred formulas and the protective seals of the Angel, the magician commands the spirits of the underworld to kneel and swear obedience, converting primal chaotic forces into structured servants of light."
      }
    ]
  },
  {
    id: "pistis-sophia",
    title: "Pistis Sophia",
    author: "Gnostic Scribes",
    category: "spiritual",
    description: "An ancient Gnostic gospel describing the teachings of the risen Jesus to his disciples, detailing the fall and redemption of Sophia (Wisdom) through the realms of light.",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Ascent of Sophia",
        content: "Sophia, looking out from her heavenly dwelling, caught sight of the Light of the Heights. Believing it to be her true source, she stretched out towards it. However, she was deceived by the self-willed power of the lower aeons, who cast her down into the chaotic darkness.\n\nFrom the depths of the abyss, Sophia sang thirteen repentances, calling upon the Supreme Light of the Universe to deliver her from the oppressive rulers of the lower realms."
      },
      {
        title: "Chapter II: The Gnostic Spheres of Light",
        content: "The universe is divided into multiple spiritual spheres. Above the physical world lie the Fate, the Sphere, and the Twelve Aeons. Above these are the Midst, the Treasury of Light, and the Ineffable Height.\n\nSalvation is the process of acquiring the gnosis—the sacred keys and seals of light—which allow the soul to ascend through these gates unimpeded after death."
      },
      {
        title: "Chapter III: The Mysteries of Redemption",
        content: "Jesus spoke to his disciples: 'Seek, and ye shall find; knock, and it shall be opened unto you. For any soul that receives the mystery of the Ineffable will dissolve all the heavy karma of the physical world and become a pillar of pure light in the eternal kingdom.'"
      },
      {
        title: "Chapter IV: The Thirteen Repentances",
        content: "Sophia cried: 'O Light of Lights, in whom I have trusted from the beginning, save me from the darkness. The lion-faced power has surrounded my light and devoured my strength. Let thy rays of grace descend upon me!'"
      },
      {
        title: "Chapter V: Return to the Heights",
        content: "The Savior stretched out His hand, casting down the blind demiurge, and raised Sophia back to the thirteenth aeon, restoring her to the sacred bridal chamber of eternal wisdom."
      }
    ]
  },
  {
    id: "tao-te-ching",
    title: "Tao Te Ching",
    author: "Lao Tzu",
    category: "spiritual",
    description: "The fundamental text of Taoism. Written in simple yet profound poetry, it teaches the concept of Wu Wei (effortless action) and living in harmony with the natural flow of the universe.",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Tao that can be spoken",
        content: "The Tao that can be spoken of is not the eternal Tao.\nThe name that can be named is not the eternal name.\nThe nameless is the origin of Heaven and Earth;\nThe named is the mother of all things.\n\nAlways without desire we can see its mystery;\nAlways with desire we can see only its manifestations.\nThese two are the same, but they have different names.\nThis sameness is the mystery, the gateway to all understanding."
      },
      {
        title: "Chapter II: Wu Wei (Effortless Action)",
        content: "When people see some things as beautiful, other things become ugly.\nWhen people see some things as good, other things become bad.\n\nTherefore the sage goes about doing nothing, teaching without talking.\nThe ten thousand things rise and fall without cease.\nThey create, but don't possess. They work, but don't take credit.\nWhen their work is done, they forget it. That is why it lasts forever."
      },
      {
        title: "Chapter III: The Power of Emptiness",
        content: "Thirty spokes join at the wheel's hub; but it is the center hole that makes the wagon move.\nClay is shaped into a vessel; but it is the empty space inside that makes it useful.\nDoors and windows are cut into a room; but it is the empty spaces that make it livable.\n\nTherefore, while we benefit from what is present, we make use of what is absent."
      },
      {
        title: "Chapter IV: Ruling with Lowliness",
        content: "The supreme good is like water, which nourishes all things without trying to. It flows to the low places that people reject; therefore it is close to the Tao. In dwelling, live close to the ground. In thinking, keep to what is simple."
      },
      {
        title: "Chapter V: Returning to the Source",
        content: "Empty yourself of everything. Let the mind become perfectly still. The ten thousand things rise and fall, while the self watches their return. Each returns to its source, finding peace and fulfilling its eternal nature."
      }
    ]
  },
  {
    id: "bhagavad-gita",
    title: "The Bhagavad Gita",
    author: "Vyasa",
    category: "spiritual",
    description: "The sacred song of Lord Krishna. Set on a battlefield, it explores the path of duty (Dharma), devotion (Bhakti), and selfless action (Karma Yoga) to achieve union with the Divine.",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Dilemma of Arjuna",
        content: "Arjuna stood in his chariot between the two massive armies on the field of Kurukshetra. Seeing his relatives, teachers, and friends lined up to fight, his heart sank, and his bow slipped from his hand.\n\n'O Krishna, I see no good in killing my own kinsmen. What joy can we find in such bloodshed? My mind is confused about my duty. Please guide me.'"
      },
      {
        title: "Chapter II: Karma Yoga (Selfless Action)",
        content: "The Blessed Lord said: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never let the fruits of action be your motive, nor should you be attached to inaction.\n\nPerform your duty with an even mind, abandoning all attachment to success or failure. Such equanimity is called Yoga. The soul is never born, nor does it ever die; it is eternal, unborn, and everlasting.'"
      },
      {
        title: "Chapter III: Devotion and the Supreme Vision",
        content: "He who sees Me in everything and sees everything in Me is never separated from Me, nor am I ever separated from him.\n\nBy offering all your actions to Me, with mind focused on Me, and full of devotion, you shall overcome all obstacles by My grace. Let go of all creeds and take refuge in Me alone; I will deliver you from all fear.'"
      },
      {
        title: "Chapter IV: Jnana Yoga (The Path of Knowledge)",
        content: "Krishna said: 'As a fire reduces wood to ashes, O Arjuna, so does the fire of self-knowledge reduce all karmic reactions to ashes. There is nothing in this world as purifying as divine wisdom.'"
      },
      {
        title: "Chapter V: The Cosmic Form",
        content: "Arjuna beheld the infinite form of the Lord, shining like a thousand suns rising together in the sky. He bowed his head in awe: 'I see all the gods in Your body, O Lord, and all living creatures in Your radiant presence.'"
      }
    ]
  },
  {
    id: "hong-gildong",
    title: "The Tale of Hong Gildong",
    author: "Heo Gyun",
    category: "korean",
    description: "The classic Korean folk novel of Hong Gildong, a brilliant youth endowed with supernatural Taoist magic. Denied his birthright, he masters cloning, wind-walking, and talismanic combat to defend the poor.",
    price: 11.99,
    priceNGN: 17985,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Prodigy of Magic",
        content: "Hong Gildong was born of a noble father and a maidservant. Denied the right to call his father 'Father' or his brother 'Brother', he spent his nights studying Taoist master scrolls and martial arts. Soon, he could summon the winds, turn straws into armed warriors, and walk across clouds."
      },
      {
        title: "Chapter II: The Robber King",
        content: "To protest corruption, Gildong formed the Hwalbindang (the League of Righteous Robbers). He rode on clay horses that came to life, created seven magical clones of himself to confuse the King's guards, and distributed royal treasures back to the starving villagers."
      },
      {
        title: "Chapter III: The Spiritual Kingdom",
        content: "Faced with Gildong's magical prowess, the King relented. Gildong departed with his followers to the mythical island of Yul-do, where he vanquished regional demons, established a spiritual kingdom free of class divides, and ruled in perfect peace."
      },
      {
        title: "Chapter IV: The Battle of the Seven Clones",
        content: "When the Royal Guard surrounded the mountain fortress, Gildong laughed. He shook his staff, and seven identical clones stepped forth, leaving the general completely baffled as they vanished into the morning wind."
      },
      {
        title: "Chapter V: The Legacy of Yul-do",
        content: "In Yul-do, no citizen was judged by birth. Farmers sang in the fields, and scholars taught the young. Gildong, now king, looked upon his island and knew the dream was complete."
      }
    ]
  },
  {
    id: "nine-cloud-dream",
    title: "Nine Cloud Dream",
    author: "Kim Man-jung",
    category: "korean",
    description: "A legendary 17th-century Korean spiritual masterpiece. It follows a young Buddhist monk who, tempted by worldly delights, is reborn into a life of absolute glory, only to realize that all earthly desires are as fleeting as a spring cloud dream.",
    price: 13.99,
    priceNGN: 20985,
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Master's Warning",
        content: "The young monk Seong-jin lived under the strict guidance of the great Zen master Yuk-gwan. One day, returning from a journey to the Dragon King's palace, Seong-jin encountered eight beautiful fairy maidens on a stone bridge. His mind became filled with desires for glory and romance."
      },
      {
        title: "Chapter II: Rebirth into Wealth",
        content: "Seeing his disciple's straying heart, the Master banished him to the cycle of reincarnation. Seong-jin awoke as Shao-you, a youth of unmatched beauty and genius. He won battles, climbed to the rank of Prime Minister, and wedded the most noble women of the empire."
      },
      {
        title: "Chapter III: The Awakening",
        content: "At the peak of his earthly splendor, Shao-you looked out over the mountains and felt a deep, piercing sorrow. An old monk appeared, striking a staff against the stone. Instantly, the palaces vanished. Seong-jin opened his eyes to find himself back in his simple monastery, realizing that the entire lifetime of success was but a single morning's dream."
      },
      {
        title: "Chapter IV: The Fairies on the Bridge",
        content: "Seong-jin remembered the laughter of the eight maidens. He realized that beauty, like the mountain mist, rises for a brief moment and is gone before the sun reaches its zenith."
      },
      {
        title: "Chapter V: True Enlightenment",
        content: "Kneeling before Master Yuk-gwan, Seong-jin bowed: 'I have traveled the world and lived a thousand lives in a single hour, Master. Now I know that the cycle of desire is but a cloud drifting across the clear sky.'"
      }
    ]
  },
  {
    id: "alexandria-library",
    title: "The Chronicles of Alexandria",
    author: "Hypatia of Alexandria",
    category: "history",
    description: "An immersive historical account of the Great Library of Alexandria, the intellectual capital of the ancient world. Trace the revolutionary scientific breakthroughs of Eratosthenes, Euclid, and the tragic fire that consumed humanity's collective memory.",
    price: 12.99,
    priceNGN: 19485,
    coverImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Beacon of Ptolemy",
        content: "Founded under the Ptolemaic dynasty in the 3rd century BCE, the Great Library of Alexandria was envisioned not merely as a museum of scrolls, but as a universal research institution. Scholars from across the Mediterranean gathered under its massive colonnades, supported by royal funding to map the stars, dissect anatomy, and translate the world's literatures into Greek.\n\nEvery ship docking in Alexandria was boarded by guards who searched for manuscripts. These scrolls were confiscated, copied with high precision, and the copies returned to the owners, while the originals remained in the Library's archive, building a collection of hundreds of thousands of scrolls."
      },
      {
        title: "Chapter II: Hypatia's Last Lecture",
        content: "In the 4th century CE, Alexandria stood as a city fractured by religious and political strife. Hypatia, a brilliant mathematician, astronomer, and Neoplatonist philosopher, continued to lecture at the library, teaching students of all faiths the eternal laws of geometry and cosmos.\n\n'Reserve your right to think,' she told her students. 'For even to think wrongly is better than not to think at all.' Her lectures drew the ire of zealots who saw her mathematical instruments and stellar charts as sorcery, leading to a tragic, violent end that marked the symbolic close of classical antiquity."
      },
      {
        title: "Chapter III: The Ashes of Knowledge",
        content: "The destruction of the Library of Alexandria was not a single catastrophic event, but a slow decline of centuries accelerated by multiple fires. Julius Caesar's fleet fires, the sacking of the Serapeum temple, and subsequent civil wars gradually dismantled the collection.\n\nWhen the final scrolls crumbled to ash, a vast treasury of human astronomical calculations, ancient histories, and lost medical treatments vanished forever, plunging the Western world into an intellectual twilight that would last for centuries."
      },
      {
        title: "Chapter IV: Eratosthenes and the Earth's Girth",
        content: "Using simple shadows and the angles of the summer sun between Alexandria and Syene, Eratosthenes calculated the circumference of the Earth with astounding precision, proving the library was a forge of monumental cosmic science."
      },
      {
        title: "Chapter V: Euclid's Elements",
        content: "Under the Library's arches, Euclid compiled the core axioms of geometry. His structured logical proofs remained the global standard of mathematical thought for over two millennia."
      }
    ]
  },
  {
    id: "silk-road-chronicles",
    title: "Echoes of the Silk Road",
    author: "Xuanzang",
    category: "history",
    description: "Travel along the ancient trade networks that linked the Far East with the Mediterranean. Discover the convergence of civilizations, the spread of Buddhism and Islam, and the legendary merchant caravans that braved the Taklamakan Desert.",
    price: 14.99,
    priceNGN: 22485,
    coverImage: "https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Gates of Chang'an",
        content: "Our journey begins in Chang'an, the eastern terminus of the Silk Road during the Tang Dynasty. Here, the city walls bustled with Sogdian merchants, Persian glassmakers, Nestorian monks, and nomadic chieftains. Caravans laden with fine mulberry silk, porcelain, and jade queued at the Western Market, preparing for the perilous desert crossing.\n\nThe route ahead was defined not by a single road, but by a shifting web of mountain passes and desert oases, where a single sandstorm or bandit raid could mean absolute ruin."
      },
      {
        title: "Chapter II: Samarkand, the Gem of the Steppe",
        content: "In the heart of Central Asia lay Samarkand, a paradise of turquoise domes and lush gardens. Nourished by the Zerafshan River, this Sogdian capital was the ultimate hub of exchange.\n\nHere, the art of Chinese papermaking met Islamic engineering and Byzantine coinage. Scholars in Samarkand's madrasas translated astronomical texts while merchants bargained in five languages, proving that the Silk Road was far more than a trade route—it was the nervous system of global culture."
      },
      {
        title: "Chapter III: The Oasis of Dunhuang",
        content: "At the edge of the Taklamakan Desert, pilgrims carved hundreds of cave temples into the sandstone cliffs of Dunhuang. Known as the Mogao Caves, these sanctuaries were painted with vivid murals of flying devas and guarded thousands of sacred manuscripts, including the world's oldest dated printed book, the Diamond Sutra.\n\nThese caves served as spiritual rest stops, where travelers prayed for safe passage before plunging into the 'Sea of Death', leaving behind a timeless record of a world where civilizations lived in harmonious fusion."
      },
      {
        title: "Chapter IV: Xuanzang's Quest for Truth",
        content: "The monk Xuanzang slipped out of China in secret, braving the scorching sands of the Gobi desert and the snowfields of the Pamirs to retrieve the original Sanskrit sutras from Nalanda, India, transforming Buddhist scholarship forever."
      },
      {
        title: "Chapter V: The Legacy of Exchange",
        content: "As silk traveled West, spices, glass, and secret technologies traveled East. The roads of the merchants became roads of philosophy, binding humanity in an early web of universal connection."
      }
    ]
  },
  {
    id: "byzantium-golden-age",
    title: "Byzantium: The Purple Empire",
    author: "Procopius of Caesarea",
    category: "history",
    description: "An epic journey into the Eastern Roman Empire at its zenith under Emperor Justinian and Empress Theodora. Relive the construction of the Hagia Sophia, the code of Roman law, and the defense of Constantinople against insurmountable odds.",
    price: 13.99,
    priceNGN: 20985,
    coverImage: "https://images.unsplash.com/photo-1569930780962-e3bd38852ab5?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Splitting of Rome",
        content: "While the Western Roman Empire collapsed under waves of migration and economic decay, the Eastern half, governed from Constantinople, endured. Perched on the Bosporus Strait, this city of stone walls and deep harbors commanded all trade between Europe and Asia.\n\nThe citizens still called themselves Romans, spoke Greek, and preserved the laws and administrative machinery of the Caesars, creating a fortress of civilization that survived for a thousand years."
      },
      {
        title: "Chapter II: The Nika Riots and Theodora's Courage",
        content: "In 532 CE, Constantinople erupted in violence during the Nika Riots. Half the city was burned, and a terrified Emperor Justinian prepared to flee by ship from the imperial harbor.\n\nIt was Empress Theodora, a former theater actress turned ruler, who halted him. 'If you wish to flee, Caesar, you have money, the ships are ready, and the sea is clear,' she said. 'But as for me, I hold to the old saying: Royal purple makes a beautiful winding sheet.' Ashamed, Justinian ordered his generals to retake the city, securing their reign."
      },
      {
        title: "Chapter III: Hagia Sophia: Heaven on Earth",
        content: "To mark their triumph and the restoration of order, Justinian commissioned the Hagia Sophia. Enlisting the brilliant mathematicians Isidore of Miletus and Anthemius of Tralles, they constructed a massive dome that seemed to float on a ring of forty golden windows.\n\nUpon entering the completed cathedral in 537 CE, Justinian gazed at the gold mosaics and shouted in awe: 'Solomon, I have surpassed thee!' The church remained the largest cathedral in the world for nearly a thousand years, a physical manifestation of imperial glory."
      },
      {
        title: "Chapter IV: The Justinian Code",
        content: "By compiling and purging a millennium of chaotic Roman statutes, Justinian's legal scholars created the Corpus Juris Civilis, the framework of civil law that still underpins modern Western jurisprudence."
      },
      {
        title: "Chapter V: Belisarius and the Reclaimed lands",
        content: "The brilliant general Belisarius sailed West with small forces, recapturing Carthage and Rome from the barbarian factions, fulfilling Justinian's grand dream of re-uniting the ancient Mediterranean empire."
      }
    ]
  },
  {
    id: "king-james-bible",
    title: "The Holy Bible (King James Version)",
    author: "Scribes of King James",
    category: "spiritual",
    description: "The monumental 1611 English translation of the Old and New Testaments, renowned for its majestic, poetic prose and enduring spiritual impact on global literature. Experience the timeless narratives of Genesis, the Psalms, and the Book of Revelation.",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1504052442567-8256c7890e25?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: In the Beginning",
        content: "In the beginning God created the heaven and the earth.\n\nAnd the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.\n\nAnd God said, Let there be light: and there was light.\n\nAnd God saw the light, that it was good: and God divided the light from the darkness.\n\nAnd God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.\n\nAnd God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters. And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so."
      },
      {
        title: "Chapter II: The Green Pastures",
        content: "The Lord is my shepherd; I shall not want.\n\nHe maketh me to lie down in green pastures: he leadeth me beside the still waters.\n\nHe restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.\n\nYea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.\n\nThou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.\n\nSurely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever."
      },
      {
        title: "Chapter III: The Revelation of Patmos",
        content: "And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.\n\nAnd I John saw the holy city, new Jerusalem, coming down from God out of heaven, prepared as a bride adorned for her husband.\n\nAnd I heard a great voice out of heaven saying, Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people, and God himself shall be with them, and be their God.\n\nAnd God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.\n\nAnd he that sat upon the throne said, Behold, I make all things new. And he said unto me, Write: for these words are true and faithful."
      },
      {
        title: "Chapter IV: The Song of Songs",
        content: "Set me as a seal upon thine heart, as a seal upon thine arm: for love is strong as death; jealousy is cruel as the grave: the coals thereof are coals of fire, which hath a most vehement flame. Many waters cannot quench love, neither can the floods drown it."
      },
      {
        title: "Chapter V: The Sermon on the Mount",
        content: "And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him. And he opened his mouth, and taught them, saying, Blessed are the poor in spirit: for theirs is the kingdom of heaven. Blessed are they that mourn: for they shall be comforted."
      }
    ]
  },
  {
    id: "english-quran",
    title: "The Holy Qur'an (English Interpretation)",
    author: "Translated Scholars",
    category: "spiritual",
    description: "A clear, accessible, and profound English interpretation of the sacred Islamic text. Delve into the core spiritual, moral, and philosophical principles of Surah Al-Fatiha, Al-Baqarah, Ayat Al-Kursi, and the cosmos-reflecting Surah Al-Mulk.",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1584282479929-3ff39a826477?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: Al-Fatiha (The Opening)",
        content: "In the name of Allah, the Entirely Merciful, the Especially Merciful.\n\n[All] praise is [due] to Allah, Lord of the worlds —\n\nThe Entirely Merciful, the Especially Merciful,\n\nSovereign of the Day of Recompense.\n\nIt is You we worship and You we ask for help.\n\nGuide us to the straight path —\n\nThe path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray."
      },
      {
        title: "Chapter II: Ayat Al-Kursi (The Throne Verse)",
        content: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence.\n\nNeither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission?\n\nHe knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills.\n\nHis Throne extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great."
      },
      {
        title: "Chapter III: Surah Al-Mulk (The Sovereignty)",
        content: "Blessed is He in whose hand is dominion, and He is over all things competent —\n\n[He] who created death and life to test you [as to] which of you is best in deed — and He is the Exalted in Might, the Forgiving —\n\n[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision to the sky; do you see any breaks?\n\nThen return your vision twice again. Your vision will return to you humbled while it is fatigued.\n\nAnd We have certainly beautified the nearest heaven with lamps and have made them [projectiles] for ruling devils and have prepared for them the punishment of the Blaze."
      },
      {
        title: "Chapter IV: Surah Al-Ikhlas (The Sincerity)",
        content: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.' This surah represents the absolute foundation of Gnostic unity and pure monotheism."
      },
      {
        title: "Chapter V: Surah Ya-Sin (The Heart of Quran)",
        content: "By the wise Qur'an, indeed you are of the messengers on a straight path. It is a revelation of the Exalted in Might, the Merciful, so that you may warn a people whose forefathers were not warned, so they are heedless. Verily, We have placed iron collars on their necks up to their chins."
      }
    ]
  },
  {
    id: "book-of-moses",
    title: "The Sacred Book of Moses",
    author: "Ancient Mystics",
    category: "spiritual",
    description: "An evocative exploration of the esoteric writings and profound visions traditionally attributed to the prophet Moses. Trace the mystical descent of celestial fires, the architectural divine plans of the Tabernacle, and the sublime ascent to the mountaintop.",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1438210159953-3b759fb98686?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Vision on Sinai",
        content: "Moses ascended the burning mount, surrounded by a heavy cloud and the terrifying sound of the celestial trumpet. The glory of the Lord rested upon Mount Sinai like a devouring fire in the eyes of the children of Israel.\n\nAnd a voice called out to him from the midst of the fire, saying, 'Draw not nigh hither: put off thy shoes from off thy feet, for the place whereon thou standest is holy ground.' There, the veil of time was parted, and Moses beheld the ancient patterns of the heavens and the earth, from their creation until their ultimate consummation in light."
      },
      {
        title: "Chapter II: The Ark and Tabernacle Mysteries",
        content: "And the Voice commanded Moses, saying, 'According to all that I shew thee, after the pattern of the tabernacle, and the pattern of all the instruments thereof, even so shall ye make it.'\n\nThey constructed the Ark of Shittim wood, overlaid with pure gold within and without, and placed upon it two golden cherubim with outstretched wings facing one another. Between their wings, the Shekinah glory—the divine light of infinite presence—would descend, acting as an oracle of absolute truth."
      },
      {
        title: "Chapter III: The Pillar of Cloud and Fire",
        content: "By day, the Lord went before them in a pillar of cloud to lead them along their path, and by night in a pillar of fire to give them light, that they might travel day and night.\n\nWhenever the cloud lifted from above the Tabernacle, the children of Israel would set out; but if the cloud did not lift, they remained camped until the day it lifted. For the cloud of the Lord was over the Tabernacle by day, and fire was in the cloud by night, in the sight of all the house of Israel throughout all their journeys."
      },
      {
        title: "Chapter IV: The Staff of Miracles",
        content: "Moses took the staff of God in his hand. When he stretched it over the Red Sea, the waters parted with a mighty east wind, creating massive walls of sapphire waves on either side, providing dry passage to the liberated host."
      },
      {
        title: "Chapter V: The Ascent of Nebo",
        content: "In his final days, Moses climbed Mount Nebo to the peak of Pisgah. There, the Creator showed him the promised lands. Though his eyes were not dim nor his natural force abated, he lay down in peace, protected by the angelic hosts."
      }
    ]
  },
  {
    id: "epic-of-gilgamesh",
    title: "The Epic of Gilgamesh",
    author: "Babylonian Scribes",
    category: "history",
    description: "The earliest surviving masterpiece of world literature, dating back to ancient Mesopotamia. Relive the saga of King Gilgamesh of Uruk, his deep friendship with the wild man Enkidu, and his epic, heartbreaking quest for the secret of eternal life.",
    price: 10.00,
    priceNGN: 15000,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The King of Uruk",
        content: "Gilgamesh, the tyrant-king of Uruk, was two-thirds divine and one-third human. He built the city's mighty ramparts, yet his boundless strength and restless pride oppressed his subjects.\n\nTo balance his power, the sky god Anu created Enkidu, a wild man of the wilderness who ran with the beasts. When the two met in the streets of Uruk, they fought like lions, but their combat ended in a profound embrace of friendship, uniting the wild plains with the high stone city."
      },
      {
        title: "Chapter II: The Fall of Enkidu",
        content: "Together, the heroes ventured to the sacred Cedar Forest, slaying the terrible giant Humbaba and defying the goddess Ishtar. But their pride invited divine retribution.\n\nThe gods decreed that Enkidu must wither and die. As Gilgamesh held his dying brother, he wept for seven days and seven nights, refusing to let him be buried until a worm crawled from Enkidu's nostril. Confronted with the cold, absolute reality of his own mortality, Gilgamesh fled Uruk into the wilderness, crying, 'Shall I not die like Enkidu? Sorrow has entered my belly; I fear death.'"
      },
      {
        title: "Chapter III: The Flower of Youth",
        content: "Gilgamesh crossed the Waters of Death to find Utnapishtim, the sole survivor of the Great Deluge who had been granted immortality by the gods.\n\nUtnapishtim told him that immortality was a privilege of the gods alone, but revealed a secret: a spiny plant at the bottom of the sea that restores youth. Gilgamesh tied stones to his feet, sank to the ocean floor, and plucked the plant.\n\nYet, on his return journey, while he bathed in a cool spring, a serpent slid from the water, smelled the plant's sweet fragrance, and stole it, shedding its skin as it slid away. Returning to Uruk empty-handed, Gilgamesh looked upon his city's high brick walls and realized that man's only true immortality is the work and memory he leaves behind."
      },
      {
        title: "Chapter IV: The Battle with the Celestial Bull",
        content: "When Ishtar loosed the Bull of Heaven to destroy Uruk, its snorts cracked the earth, devouring hundreds of citizens. But Gilgamesh and Enkidu leapt upon its horns, driving a sword into its neck to defend the city."
      },
      {
        title: "Chapter V: Slaying Humbaba",
        content: "In the dark shadows of the Cedar Forest, the roar of Humbaba shook the trees. Armed with axes and bronze swords, Gilgamesh invoked the great winds of Shamash, binding the beast in storm gates before claiming victory."
      }
    ]
  },
  {
    id: "principia-mathematica",
    title: "Philosophiae Naturalis Principia Mathematica",
    author: "Sir Isaac Newton",
    category: "science",
    description: "The crown jewel of modern science. Newton outlines the universal laws of motion, the law of gravitation, and the mathematical framework that governs the physical orbits of planets and stars.",
    price: 12.00,
    priceNGN: 18000,
    coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Three Laws of Motion",
        content: "Law I: Every body continues in its state of rest, or of uniform motion in a right line, unless it is compelled to change that state by forces impressed upon it.\n\nLaw II: The change of motion is proportional to the motive force impressed; and is made in the direction of the right line in which that force is impressed.\n\nLaw III: To every action there is always opposed an equal reaction: or the mutual actions of two bodies upon each other are always equal, and directed to contrary parts."
      },
      {
        title: "Chapter II: The Universal Law of Gravitation",
        content: "Every particle of matter attracts every other particle with a force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between them.\n\nThis single, elegant law explains both the fall of an apple on Earth and the eternal, stable orbits of the moon and the distant planets around the sun."
      },
      {
        title: "Chapter III: The Orbits of Heavenly Bodies",
        content: "Using mathematical calculus, we demonstrate that the orbits of planets must be ellipses with the sun at one focus. This resolves the ancient Keplerian mysteries and establishes a clockwork universe governed by absolute mathematical laws."
      },
      {
        title: "Chapter IV: Tidal Forces and the Moon",
        content: "The gravitational pull of the moon and the sun acts continuously upon the waters of the Earth. This differential force creates the predictable, rhythmic rise and fall of oceanic tides twice daily across our globe."
      },
      {
        title: "Chapter V: The System of the World",
        content: "Thus we have laid open the constitution of the cosmos. From the smallest projectile on Earth to the grandest comets sweeping past the sun, all physical bodies submit to the same simple, immutable mathematical equations."
      }
    ]
  },
  {
    id: "origin-of-species",
    title: "On the Origin of Species",
    author: "Charles Darwin",
    category: "science",
    description: "The revolutionary book that transformed our understanding of life. Darwin presents the theory of natural selection—the mechanism by which species adapt, survive, and diversify over deep geological time.",
    price: 10.00,
    priceNGN: 15000,
    coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: Variation Under Domestication",
        content: "When we compare the individuals of the same variety of our oldest cultivated plants and animals, we find they differ more from each other than do the individuals of any one wild species.\n\nThis variation is driven by selective breeding. Humans select the best traits in dogs, horses, and pigeons. If humans can achieve such rapid, visible changes in a few generations, nature can do so infinitely more over geological epochs."
      },
      {
        title: "Chapter II: Struggle for Existence",
        content: "A struggle for existence inevitably follows from the high rate at which all organic beings tend to increase. Every being must suffer destruction during some period of its life, otherwise its numbers would become so superabundant that no country could support the product.\n\nHence, as more individuals are produced than can possibly survive, there must in every case be a struggle for life, either with individuals of the same species or with the physical conditions of environment."
      },
      {
        title: "Chapter III: Natural Selection",
        content: "This preservation of favorable individual differences, and the destruction of injurious variations, I call Natural Selection, or the Survival of the Fittest.\n\nNature acts on the whole machinery of life. Any variation, however slight, that gives an individual an advantage over others in the struggle for life will tend to be preserved, allowing that individual to survive and pass on its traits to its offspring."
      },
      {
        title: "Chapter IV: The Tree of Life",
        content: "The affinities of all the beings of the same class have sometimes been represented by a great tree. I believe this simile largely speaks the truth. As buds give rise by growth to fresh buds, so the great Tree of Life has filled the crust of the earth with its dead and broken branches, and covers the surface with its beautiful and branching ramifications."
      },
      {
        title: "Chapter V: Conclusion and the Ascent of Man",
        content: "There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one; and that, whilst this planet has gone cycling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved."
      }
    ]
  },
  {
    id: "einstein-relativity",
    title: "The Universe of Einstein (Relativity)",
    author: "Albert Einstein",
    category: "science",
    description: "The complete guide to Special and General Relativity. Discover how gravity is not a pull, but the curvature of space and time itself under the weight of massive stars and planets.",
    price: 10.00,
    priceNGN: 15000,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Speed of Light as a Constant",
        content: "The speed of light in a vacuum is always the same, regardless of whether the light source is stationary or moving at extreme speeds relative to the observer.\n\nThis constant speed forces our traditional concepts of space and time to become flexible. Time slows down for clocks moving near the speed of light, and objects contract in the direction of their motion, a phenomenon known as time dilation and Lorentz contraction."
      },
      {
        title: "Chapter II: The Equivalence of Mass and Energy",
        content: "Mass and energy are but two different manifestations of the exact same physical property. This relationship is mathematically locked in the world's most famous equation:\n\nE = mc²\n\nWhere 'E' represents energy, 'm' represents mass, and 'c' represents the constant speed of light. Because the speed of light is a massive number, a minuscule amount of matter can be converted into an immense, world-shaking blast of pure physical energy."
      },
      {
        title: "Chapter III: Gravity as Space-Time Curvature",
        content: "In General Relativity, gravity is no longer a mysterious force pulling objects across empty space. Instead, massive bodies like the Sun warp the fabric of space-time around them.\n\nJust as a heavy bowling ball creates a dip on a stretched rubber sheet, causing nearby marbles to roll around it, planets orbit the Sun because they are following the curved contours of space-time created by the Sun's massive weight."
      },
      {
        title: "Chapter IV: The Bending of Light",
        content: "Because space-time itself is curved around massive bodies, even light waves passing near a star must follow these curved lines. During a solar eclipse, we can see stars behind the Sun shifted from their true positions, confirming that gravity indeed bends light."
      },
      {
        title: "Chapter V: Time in Strong Gravitational Fields",
        content: "Gravity slows down time. Clocks closer to the center of a massive body tick slower than clocks far out in deep space. Near a black hole, this effect reaches an extreme, where time stands completely still at the event horizon."
      }
    ]
  },
  {
    id: "heaven-revelations",
    title: "Celestial Revelations: A Journey Through the Heavens",
    author: "Dante Alighieri & Mystics",
    category: "spiritual",
    description: "A breathtaking tour of the celestial realms and heavenly spheres. Explore the radiant cities of gold, the nine concentric heavens of light, and the ultimate vision of the divine throne of infinite peace.",
    price: 8.00,
    priceNGN: 12000,
    coverImage: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Gates of Pearl",
        content: "The seeker stood before the golden gates, rising like pillars of frozen fire into the cloudless violet sky. A majestic guardian angel with wings of woven light stepped forward, holding a golden key.\n\n'Enter, O mortal adept,' the angel whispered, 'and behold the city of the Great King, where there is no night, nor sun, nor moon, for the glory of the light is the lamp thereof.'"
      },
      {
        title: "Chapter II: The Nine Spheres of Light",
        content: "We ascended through the nine concentric circles of heaven. The First Sphere shone like polished silver, representing the realm of peaceful souls. As we rose higher, the light changed to brilliant sapphire, emerald, and gold, each sphere echoing with the celestial music of the spheres.\n\nIn the Seventh Heaven, the realm of the mystics, we beheld a golden ladder reaching beyond our sight, upon which angels of fire descended and ascended in perfect, harmonious order."
      },
      {
        title: "Chapter III: The Throne of Sapphire",
        content: "In the ultimate height of the Empyrean, the light became so intense that human eyes could not bear it, yet we were granted spiritual vision. At the center of the universe sat the Throne, surrounded by a rainbow that looked like an emerald.\n\nFrom the Throne flowed a river of crystal water, nourishing the trees of life on either side. A profound silence fell over the millions of angels, and we knew the peace that passeth all human understanding."
      },
      {
        title: "Chapter IV: The Choir of Seraphim",
        content: "The Seraphim, the angels of burning love, circled the throne, singing: 'Holy, Holy, Holy is the Lord of hosts; the whole earth is full of His glory!' Their voices created waves of golden light that rippled through the heavenly architecture."
      },
      {
        title: "Chapter V: Eternal Reunion",
        content: "In this realm of light, all souls are united in a web of perfect love. No sorrow exists, for every tear has been wiped away, and the human spirit is merged into the boundless sea of infinite bliss."
      }
    ]
  },
  {
    id: "mind-and-soul",
    title: "The Harmony of Mind and Soul",
    author: "Ancient Philosophers",
    category: "spiritual",
    description: "An evocative psychological and philosophical treatise on alignment of human thoughts (mind) with the eternal essence (soul) to achieve spiritual clarity, mental health, and infinite wisdom.",
    price: 7.00,
    priceNGN: 10500,
    coverImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Mind as a Mirror",
        content: "The human mind is like a quiet lake. When the waters are agitated by desires and fears, the mirror is cracked, reflecting only distorted images of reality.\n\nTo see things as they truly are, one must quiet the mind. When the thoughts are perfectly still, the lake becomes a pure mirror, reflecting the eternal light of the soul above."
      },
      {
        title: "Chapter II: The Essence of the Soul",
        content: "The soul is not a physical organ, nor is it a product of brain chemistry. It is the silent observer, the divine spark that existed before the body was formed and will remain when the physical temple returns to dust.\n\nWhile the mind is busy sorting, calculating, and judging, the soul simply observes with infinite patience and unconditional love."
      },
      {
        title: "Chapter III: Achieving Inner Alignment",
        content: "True happiness is found when the thoughts of the mind are in perfect alignment with the wisdom of the soul. If the mind pursues wealth and fame while the soul desires peace and connection, a painful fracture occurs within.\n\nListen to the quiet voice of intuition in the moments of silence, for it is the bridge by which the soul communicates its eternal wishes to the active mind."
      },
      {
        title: "Chapter IV: The Ego's Illusion",
        content: "The ego is a mask the mind creates to protect itself from a hostile world. It believes it is separate and isolated. The soul, however, knows that all life is connected in a single, breathing web of universal consciousness."
      },
      {
        title: "Chapter V: The Master's Peace",
        content: "By practicing daily meditation, a practitioner can dissolve the ego's walls, letting the peaceful essence of the soul flood the active mind, establishing a state of joy that no external storm can shake."
      }
    ]
  },
  {
    id: "book-of-shadows",
    title: "The Book of Shadows & Nocturnal Spells",
    author: "High Priestesses",
    category: "shadows",
    description: "A sacred grimoire of nocturnal magic, shadow-work, lunar cycles, and spells of self-protection. It teaches how to find strength in your dark side, utilizing the hidden powers of the subconscious.",
    price: 15.00,
    priceNGN: 22500,
    coverImage: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Magic of the New Moon",
        content: "The New Moon is the canvas of the dark witch. When the sky is perfectly dark, the veil between the physical and spiritual worlds is at its thinnest, making it the ideal time to plant seeds of intent.\n\nIn the quiet dark of your chambers, light a single black candle. Focus your intent on what you wish to banish and what you wish to draw from the fertile void, writing your desires in the book of shadows."
      },
      {
        title: "Chapter II: Shadow Work and Subconscious Integration",
        content: "True magic does not hide from the dark. The shadow is the collection of your rejected traits, fears, and suppressed desires. To deny your shadow is to cut your personal power in half.\n\nEnter your inner temple and face your shadow with love and courage. Ask: 'What do you wish to teach me?' By integrating the shadow, you convert raw fear into solid protective shields."
      },
      {
        title: "Chapter III: Talismans of the Dark Hours",
        content: "To construct a nocturnal talisman, gather roots of mugwort, dried elderberries, and obsidian stones. Consecrate them in the dark hours under the light of the waning moon.\n\nThese ingredients, when placed in a black silk pouch and marked with the rune of protection, will absorb any negative thoughts directed toward you, turning hostile intents into harmless mist."
      },
      {
        title: "Chapter IV: The Incantation of the Silver Light",
        content: "Recite when the moon is full: 'O Lunar Mother, glowing in the velvet night, shield my spirit from the arrows of the day. Let thy silver light cleanse my sanctuary, keeping all unbalanced forces outside my gates.'"
      },
      {
        title: "Chapter V: The Seal of Silence",
        content: "The final law of shadow magic is silence. To speak of your spells is to scatter their power. Keep your rituals closed within your heart and within this book of shadows, letting their strength build in absolute secrecy."
      }
    ]
  },
  {
    id: "dhammapada-buddha",
    title: "The Dhammapada & Buddha's Magic Ingredients of Mind",
    author: "Gautama Buddha",
    category: "magic", // Buddha's magic ingredients requested under Buddha books category!
    description: "The core Buddhist path of wisdom, detailing the 'magic ingredients' of mental mastery: Mindfulness, Concentration, Loving-Kindness, and the complete extinguishing of suffering (Nirvana).",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1609137144813-7d722ef27a7c?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Mind is the Creator",
        content: "We are what we think. All that we are arises with our thoughts. With our thoughts, we make the world.\n\nSpeak or act with an impure mind, and trouble will follow you as the wheel follows the ox that draws the cart. Speak or act with a pure mind, and happiness will follow you like a shadow that never leaves."
      },
      {
        title: "Chapter II: The Magic Ingredient: Mindfulness (Sati)",
        content: "Mindfulness is the path to the deathless. Lack of mindfulness is the path to death. Those who are mindful do not die, while the unmindful are as if already dead.\n\nBy keeping watch over your thoughts, words, and breath, you construct a fortress that no flood of passion can overcome. This is the first magic ingredient of spiritual liberation."
      },
      {
        title: "Chapter III: The Magic Ingredient: Loving-Kindness (Metta)",
        content: "Hatred does not cease by hatred at any time. Hatred ceases by love alone. This is an eternal law.\n\nJust as a mother protects her only child with her life, let your mind overflow with boundless love for all living creatures, radiating light to the heights, the depths, and across the world, without limit."
      },
      {
        title: "Chapter IV: The Magic Ingredient: Equanimity (Upekkha)",
        content: "As a solid rock is not shaken by the wind, so are the wise unshaken by praise or blame. They remain calm and centered in all circumstances, realizing that all physical forms are fleeting."
      },
      {
        title: "Chapter V: Nirvana: The Unconditioned",
        content: "There is a realm where there is neither earth, nor water, nor fire, nor wind. It is the end of sorrow. When all desires have been extinguished, the soul enters the supreme silence of Nirvana, free from the cycle of rebirth."
      }
    ]
  },
  {
    id: "tibetan-dead-book",
    title: "The Tibetan Book of the Dead",
    author: "Padmasambhava",
    category: "deaths",
    description: "The famous Bardo Thodol. An ancient guide read to the dying to shepherd their consciousness through the intermediate states (Bardos) between death and rebirth.",
    price: 12.00,
    priceNGN: 18000,
    coverImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: The Moment of Passing",
        content: "O nobly-born, the time hath come for thee to seek the Path. Thy breath is ceasing. The Clear Light of the Pure Reality is dawning before thee.\n\nDo not let thy mind wander. Recognize this light as the essence of thine own soul. Merge thy consciousness into it, and thou shalt be liberated instantly from the cycle of birth and death."
      },
      {
        title: "Chapter II: The Bardo of the Peaceful Deities",
        content: "If thou failest to recognize the Clear Light, thy consciousness will enter the second Bardo. There, beautiful and majestic deities of pure white, blue, and gold light will appear before thee.\n\nDo not be afraid of their radiant light, for they are but the projections of thine own mind's pure virtues. If thou embracest them, they will carry thee to the Western Paradise of Amitabha."
      },
      {
        title: "Chapter III: The Bardo of the Wrathful Deities",
        content: "In the later days of the Bardo, terrifying, multi-headed wrathful deities surrounded by flames will manifest before thee. They will roar like thunder and hold weapons of judgment.\n\nDo not flee from them, O nobly-born! Realize that they are but the projections of thy mind's own suppressed fears. If thou recognizest them as illusions, they will dissolve into peaceful streams of light."
      },
      {
        title: "Chapter IV: Choosing a New Womb",
        content: "If thou art still drawn back to the physical world, thou wilt see visions of couples embracing. A strong desire will pull thee toward a new birth. Choose thy parents wisely, focusing on a family of spiritual devotion and kindness."
      },
      {
        title: "Chapter V: The Awakening",
        content: "Whether reborn on Earth or liberated in the realms of light, remember that all experiences are but dreams of the mind. Wake up from the dream, and find eternal freedom."
      }
    ]
  },
  {
    id: "egyptian-dead-book",
    title: "The Egyptian Book of the Dead",
    author: "Egyptian Scribes",
    category: "deaths",
    description: "The Papyrus of Ani. Discover the ancient Egyptian magical spells and incantations to navigate the underworld of Duat, defeat dangerous monsters, and stand before the scale of Osiris.",
    price: 14.00,
    priceNGN: 21000,
    coverImage: "https://images.unsplash.com/photo-1600577916048-804c9191e36c?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter I: Entering the Underworld (Duat)",
        content: "The soul of Ani declared: 'I have traveled through the gates of the West, and I have defeated the shadows of the tomb. I stand before the lords of the Duat, pure and clothed in white linen.'\n\nTo pass safely past the seven gates of the underworld, the deceased must recite the secret names of the guardians, commanding them to open the stone arches with the authority of the sun god Ra."
      },
      {
        title: "Chapter II: The Weighing of the Heart",
        content: "In the Hall of Ma'at, the jackal-headed god Anubis places the heart of the deceased on one side of the golden scale, and the feather of truth and cosmic order on the other.\n\nThe ibises of Thoth stand ready to write down the verdict, while the monster Ammit crouches below, waiting to devour any heart weighed down by sin and injustice."
      },
      {
        title: "Chapter III: The Negative Confession",
        content: "Before Osiris, the King of Eternity, the deceased declares: 'I have not stolen. I have not committed violence. I have not polluted the sacred waters of the Nile. I have not spoken lies.'\n\nThese declarations, when spoken with absolute truth, cause the golden scale to balance perfectly, proving the soul's purity and granting them passage to the Fields of Reeds."
      },
      {
        title: "Chapter IV: Defeating the Serpent Apep",
        content: "When the giant serpent of chaos Apep rises from the dark waters to swallow the solar barque, the deceased recites the magic spell: 'Be cast back, O serpent! Ra has chopped thy head, and thy body is burnt to ashes!'"
      },
      {
        title: "Chapter V: Rising as a Golden Falcon",
        content: "Having balanced the scale, the soul is transformed into a divine golden falcon. It flies out of the tomb into the eternal sky, sailing with Ra in the daylight and joining the circumpolar stars that never set."
      }
    ]
  },
  {
    id: "illuminati-secrets",
    title: "The Illuminati Codex: Secret Society & Order of the Mind",
    author: "Adam Weishaupt",
    category: "history",
    description: "An authentic historical grimoire from the Bavarian Order of Illuminati. Discover the levels of initiation, secret alphabets, and symbols of the hand and eye that govern society from Chapter A to Z.",
    price: 18.00,
    priceNGN: 27000,
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter A: Assembly of the Novice",
        content: "The Order begins with the Novice, who must learn the first rules of absolute mental discipline. To observe others while remaining unseen is the prime masterkey. Every novice must maintain a private diary, recording daily behaviors, emotional triggers, and social dynamics observed in their immediate circles.\n\nThe mind of the novice is a blank parchment. Only after three years of silent submission to the higher initiates will the seal of Minerva be placed upon their forehead, unlocking the second level of illuminated perception."
      },
      {
        title: "Chapter B: Brotherhood of the Mind",
        content: "All initiates are bound by a sacred covenant of mutual aid, intellectual enrichment, and common purpose. Class divisions and national boundaries are declared null inside the Order's temple. We speak a universal language of symbols, recognizing each other through custom hand-gestures, subtle eye expressions, and secret letter prefixes.\n\nBy pooling together the absolute brightest minds in science, philosophy, law, and arts, the Brotherhood establishes a silent sovereign republic that operates beneath the chaotic surface of political kingdoms."
      },
      {
        title: "Chapter C: Cipher of the Secret Owl",
        content: "The Owl of Minerva represents wisdom that wakes in the dark. The secret cipher of the Order replaces standard letters with geometric lines, calendar numbers, and solar degree markers. Our letters do not name historical cities, but use celestial coordinates and ancient Greek synonyms to shield our correspondence from imperial censors.\n\nTo write with the Owl is to communicate directly from soul to soul, skipping the biased channels of modern states and religious dogmas."
      },
      {
        title: "Chapter M: Minerva's Temple of Light",
        content: "Under the midnight arches of the temple, the initiate is taught that God is not a human tyrant in the clouds, but the Supreme Architect of the Universe. Our rituals are designed to demystify nature, replacing fear and superstition with raw scientific observation and mental transmutation.\n\nEvery member is a living pillar of this unseen Temple, commissioned to establish universal education, defend human liberty, and foster absolute intellectual progress."
      },
      {
        title: "Chapter Z: Zenith of the New Order",
        content: "The final degree reveals the ultimate grand plan: Novus Ordo Seclorum—a New Order of the Ages. This is not a conquest of swords, but a slow, peaceful revolution of minds.\n\nWhen the light of reason has successfully penetrated every level of human society, the old structures of ignorance, warfare, and elite corruption will naturally dissolve, leaving behind a global federation ruled by the wise and guided by the eternal stars of cosmic wisdom."
      }
    ]
  },
  {
    id: "incantation-magic",
    title: "The Supreme Grimoire of Incantation Magic",
    author: "Eliphas Levi",
    category: "magic",
    description: "A powerful textbook of vocal resonance, word spells, and dynamic sound-magic. Master the spoken vowels and high-vibrational incantations to shift your physical environment from Chapter A to Z.",
    price: 15.00,
    priceNGN: 22500,
    coverImage: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter A: Astral Voice Tuning",
        content: "Every sound is a physical vibration that ripples through the invisible ether. The incantation mage does not speak from the throat, but draws breath from the deep solar plexus, projecting the voice like a sounding bow.\n\nBefore executing any verbal spell, sit in absolute stillness and hum the fundamental note of the Earth—corresponding to a deep 'C' minor. Feel the vibration rise from your spine up through the roof of your mouth, tuning your vocal cords to the resonance of the cosmos."
      },
      {
        title: "Chapter G: Gnostic Vowel Vibrations",
        content: "The seven vowels of the ancient Greek alphabet—Alpha, Epsilon, Eta, Iota, Omicron, Upsilon, and Omega—represent the seven planetary rulers of our solar system. When chanted in a single breath, they create a protective bubble that repels all negative thoughts.\n\nRepeat: 'A-E-H-I-O-Y-Ω' in an ascending scale. The sound of Alpha aligns with the Moon, while Omega reaches the gold crowns of Saturn, converting your spoken breath into an impenetrable shield of pure celestial geometry."
      },
      {
        title: "Chapter I: Incantation of the Solar Shield",
        content: "To protect your home and temple, stand facing the East at dawn. Project your voice with absolute confidence: 'YOD HE VAU HE, LORD OF LIGHTS, HEAR THE RESOUNDING WORD. ESTABLISH THE WALLS OF GOLDEN FIRE!'\n\nVisualise your spoken words transforming into a burning wave of amber light that encircles your immediate environment, vaporizing any astral intrusions or psychic shadows before they can cross your threshold."
      },
      {
        title: "Chapter O: Overtones of Power",
        content: "Mastering the double-voice, or vocal overtones, allows the magician to speak on two vibrational planes simultaneously. The lower tone commands the elementals of the physical earth, while the high, whistling overtone rings the bells of the celestial realm.\n\nBy practicing this sacred split-voice, the magician bridges the micro-cosmos with the macro-cosmos, executing immediate adjustments in the astral atmosphere with simple whispered words."
      },
      {
        title: "Chapter Z: Zenith of the Sacred Breath",
        content: "The ultimate peak of vocal magic is the silent word—spoken entirely within the chambers of the mind. This internal incantation carries the same potency as a physical thunderclap, but operates on the highest spiritual planes.\n\nWhen the mind can hold the perfect image of a word's sound without releasing it through the throat, the magician becomes a silent creator, projecting raw spiritual law directly into the universal canvas of reality."
      }
    ]
  },
  {
    id: "wisdom-knowledge",
    title: "The Golden Keys of Wisdom and Knowledge",
    author: "Hermes Trismegistus",
    category: "spiritual",
    description: "Universal philosophical truths, mental discipline guidelines, and keys to spiritual enlightenment. Learn to master your internal thoughts and unlock the cosmic library from Chapter A to Z.",
    price: 5.00,
    priceNGN: 7500,
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter A: Awakening the Inner Master",
        content: "Wisdom begins not with the accumulation of facts, but with the systematic unlearning of worldly illusions. You are not a separate drop of water, but the entire ocean in a temporary container.\n\nTo awaken the Inner Master, withdraw your senses from the noise of marketplace politics. Sit in the quiet cave of your heart and watch your thoughts rise and fall like clouds. Realize you are the silent sky behind them, untouched and eternally wise."
      },
      {
        title: "Chapter K: Knowledge of the Divine Spark",
        content: "Deep inside the soul of every human lies a spark of the absolute creator. This spark is hidden beneath layers of physical habits, negative beliefs, and social conditioning.\n\nTrue knowledge (Gnosis) is the direct, unmediated experience of this spark. It cannot be taught by books or priests. It is uncovered in the deep moments of meditation, where the self melts into the light of absolute unity, realizing that 'I and the cosmos are One.'"
      },
      {
        title: "Chapter L: Law of Mentalism",
        content: "The supreme law of reality is simple: 'THE ALL is MIND; The Universe is Mental.' All physical matter is but condensed thought-vibrations created by the supreme mind of the universe.\n\nBy mastering your thoughts, you master your life. Change the channel of your thoughts, and your material circumstances must change to match your new vibration. This is the ultimate masterkey of the ancient sages."
      },
      {
        title: "Chapter W: Wisdom of the Silent Silence",
        content: "The deepest wisdom is spoken in perfect silence. Words are but crude signposts pointing to a reality that lies beyond language.\n\nIn the quiet spaces between your breaths, the secrets of creation are revealed. Practice resting in this silence for thirty minutes daily. Let the quiet water wash away all your mental clutter, filling your spirit with the calm, steady joy of the eternal source."
      },
      {
        title: "Chapter Z: Zenith of Unification",
        content: "The highest state of enlightenment is the complete dissolution of the illusion of separation. There is no 'inside' and 'outside'. The observer is the observed.\n\nWhen you can look at a star, a tree, or an enemy and feel them as your own self, you have reached the Zenith. You have entered the timeless garden of peace, where there is no more birth or death, but only the infinite dance of the one eternal light."
      }
    ]
  },
  {
    id: "magic-of-pharaoh",
    title: "Heka: The Magic of Pharaoh and High Priests of Egypt",
    author: "Imhotep",
    category: "history",
    description: "The authentic systems of Heka, the sacred magic that raised the pyramids and bound cosmic deities. Learn Egyptian talisman-engraving, the Eye of Horus rituals, and solar magic from Chapter A to Z.",
    price: 12.00,
    priceNGN: 18000,
    coverImage: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter A: Ancient Heka Principles",
        content: "Heka is the primal force of creation. It existed before the gods were born, and it is through Heka that Ra spoke the first words of light.\n\nTo practice Heka, the high priest must align their heart with Ma'at—the cosmic order. The magic of Pharaoh is not used for selfish desires, but to maintain the balance of the sky and the earth, ensuring that the Nile flows and the crops grow in their proper season."
      },
      {
        title: "Chapter E: Eye of Horus Protection",
        content: "The Wadjet, or Eye of Horus, is the ultimate amulet of protective magic. It represents healing, wholeness, and the defensive fire of the sun god.\n\nTo consecrate the Eye, carve its pattern on a tablet of green jasper during the hour of sunrise. Anoint it with pure lotus oil and chant: 'I am the healed one, protected by the eye of the falcon. No shadow can penetrate my light.' Wear it upon your chest to repel all hostile glances."
      },
      {
        title: "Chapter P: Pharaoh's Golden Crown Ritual",
        content: "The double crown of Egypt—the white Hedjet of the south and the red Deshret of the north—represents the unification of the masculine and feminine energies within the ruler.\n\nIn the sacred chamber behind the Sphinx, the Pharaoh undergoes the coronation of fire. By meditating on the two snakes of the crown rising at the third eye, they open the inner eye of divine sight, receiving the spiritual authority to rule both the physical and astral kingdoms."
      },
      {
        title: "Chapter S: Solar Barque Journey",
        content: "Every night, the sun god Ra journeys through the twelve dark hours of the underworld in his golden barque. The priests of Heka join this journey in spirit, chanting spells to defend the barque from the dark serpent Apep.\n\nBy rising above our primal fears and casting our spells of light, we help the sun to rise once more, celebrating the daily victory of light over darkness in our own souls and across the earth."
      },
      {
        title: "Chapter Z: Zenith of Osiris",
        content: "Osiris is the god of resurrection, the lord of life that springs from death. The ultimate mystery of Egypt is that every human is a sleeping Osiris, waiting to be awakened.\n\nBy completing the sacred rites of Heka and balancing our hearts on the scale of truth, we rise from the tomb of our physical limitations, transformed into brilliant stellar beings that shine forever in the northern sky."
      }
    ]
  },
  {
    id: "demon-grimoire",
    title: "The Shadow Hierarchy: Demonic Names and Seals",
    author: "King Solomon",
    category: "shadows",
    description: "An academic study of demonology, historical grimoires, and defensive circle casting. Outlines the 72 celestial and infernal names to understand and bind sub-astral forces from Chapter A to Z.",
    price: 15.00,
    priceNGN: 22500,
    coverImage: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter A: Abyss and Celestial Spheres",
        content: "The universe is structured in perfect balance. For every high celestial archangel, there exists a corresponding sub-astral force in the deep abyss.\n\nThese lower forces are not evil creators, but represents the raw, chaotic energies of the material world. The scholar must study them with absolute emotional detachment, realizing that any fear or anger in the heart will tear the protective circle, leaving the mind open to astral confusion."
      },
      {
        title: "Chapter B: Binding the Infernal Wind",
        content: "When the chaotic spirits are summoned to the Triangle of Art, they will try to confuse the practitioner with terrifying shapes and roaring winds.\n\nStand firm in your circle of protection. Hold your consecrated iron sword and declare: 'By the authority of the supreme architect, I command you to appear in a pleasant, human form and answer my questions truthfully.' Speak with absolute calm, for the spirits only obey the mind that is perfectly still."
      },
      {
        title: "Chapter S: Seals of Protective Circles",
        content: "The magic circle is your fortress. It must be drawn with white chalk or consecrated salt, exactly nine feet in diameter, and marked with the four sacred names of God at the compass points.\n\nWithin this circle, you are shielded from all sub-astral currents. Never step outside the border until the ritual is complete and the spirits have been politely licensed to depart, ensuring that the boundary between the worlds remains unbroken."
      },
      {
        title: "Chapter T: Transforming Primal Desires",
        content: "The spirits of the abyss represent our own hidden, primal desires—ambition, passion, survival, and power. To destroy these desires is to lose our vital force.\n\nThe wise master does not destroy them, but binds them with reason. By channeling our primal energies into structured creative works—such as art, science, and philanthropy—we convert raw, chaotic steam into stable engines of global progress."
      },
      {
        title: "Chapter Z: Zenith of Light Mastery",
        content: "The ultimate peak of shadow study is the complete integration of our inner dark and light forces. We do not fear the dark, nor do we worship the light. We stand as the conscious axis between them.\n\nHaving mastered both the high celestial spheres and the deep sub-astral chambers, the practitioner is crowned with absolute self-ownership, standing as a complete, sovereign soul in the center of the infinite cosmos."
      }
    ]
  },
  {
    id: "angels-book",
    title: "Celestial Whispers: The Book of Enoch & Angelic Names",
    author: "Prophet Enoch",
    category: "spiritual",
    description: "Explore the celestial hierarchy of Archangels, Seraphim, and Cherubim. Learn the names, alignments, and high-vibrational seals of Michael, Gabriel, Raphael, and Uriel from Chapter A to Z.",
    price: 10.00,
    priceNGN: 15000,
    coverImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=400",
    chapters: [
      {
        title: "Chapter A: Angelic Realms of Enoch",
        content: "The prophet Enoch was carried up by two shining messengers into the ten heavens of light. There, he beheld the infinite palace of the Creator, constructed of transparent crystals and surrounded by rivers of living fire.\n\nIn these high realms, the holy angels do not rest. They sing the thrice-holy hymn of praise day and night, maintaining the mathematical order of the stars and the seasons, acting as the radiant hands of the divine architect."
      },
      {
        title: "Chapter G: Gabriel's Silver Scroll",
        content: "Gabriel is the angel of announcement, dream-mastery, and spiritual guidance. His light is silver and corresponds to the celestial influence of the Moon.\n\nWhen you are confused about your life path, pray to Gabriel before sleeping. Visualise his silver wings wrapping around your bed, and he will bring clear, prophetic guidance in your dreams, writing the solutions to your problems on the silver scroll of your heart."
      },
      {
        title: "Chapter M: Michael's Solar Sword of Fire",
        content: "Michael is the supreme commander of the celestial armies, the defender of justice and protector from all dark forces. His light is brilliant gold, aligned with the Sun.\n\nWhen you feel fear or psychic oppression, invoke Michael: 'Archangel Michael, defend me in battle. Cut away all negative attachments with your sword of fire!' Visualise his golden shield of light surrounding you, burning away any dark threads or negative energies instantly."
      },
      {
        title: "Chapter R: Raphael's Emerald Healing Light",
        content: "Raphael is the divine physician, the angel of healing, travelers, and physical rejuvenation. His light is bright emerald green, aligned with the planet Mercury.\n\nTo draw his healing presence, close your eyes and breathe in a deep, glowing green cloud. Visualise Raphael placing his hands on your body, restoring every cell, bone, and thought to its perfect, healthy, and harmonious alignment with the divine blueprint."
      },
      {
        title: "Chapter Z: Zenith of Divine Harmony",
        content: "The ultimate goal of Enoch's teachings is the complete harmonization of our physical life with the high angelic frequencies. We are called to be angels in human form.\n\nBy practicing absolute kindness, speaking truth, and defending the weak, we lower the heavenly vibrations to the physical Earth, turning our temporary physical lives into a radiant bridge of divine peace and light."
      }
    ]
  }
];
