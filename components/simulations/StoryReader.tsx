"use client";
import { useState } from 'react';
import { speakLetter } from '@/lib/speak';
import { ChevronLeft, ChevronRight, Volume2, BookOpen, RotateCcw, Sparkles } from 'lucide-react';

type Question = { q: string; options: string[]; answer: number };
type Story = {
  id: string;
  title: string;
  emoji: string;
  level: 'सोपी' | 'मध्यम' | 'कठीण';
  tribe?: string;
  moral?: string;
  pages: string[];
  questions: Question[];
};

const STORIES: Story[] = [
  // ── Original stories ─────────────────────────────────────────────────────
  {
    id: 'amba',
    title: 'आंब्याचे झाड',
    emoji: '🥭',
    level: 'सोपी',
    moral: 'जुन्या गोष्टींमध्ये आठवणी आणि माया असते.',
    pages: [
      'आमच्या घराजवळ एक मोठे आंब्याचे झाड आहे. ते खूप जुने झाड आहे. आजोबांनी ते लावले होते.',
      'उन्हाळ्यात झाडावर खूप आंबे येतात. आंबे पिवळे आणि गोड असतात. त्यांचा वास खूप छान येतो.',
      'आम्ही झाडाखाली बसतो. सावलीत बसून आम्ही खेळतो. कधी कधी जेवणही तिथेच करतो.',
      'आई आंब्याचे लोणचे बनवते. ती आंब्याचा रस पण करते. रस पिण्यात खूप मजा येते.',
    ],
    questions: [
      { q: 'झाड कोणी लावले होते?', options: ['आईने', 'आजोबांनी', 'बाबांनी', 'शेजाऱ्यांनी'], answer: 1 },
      { q: 'उन्हाळ्यात झाडावर काय येते?', options: ['फुले', 'आंबे', 'पाने', 'पक्षी'], answer: 1 },
      { q: 'आई आंब्यापासून काय बनवते?', options: ['भाजी', 'लोणचे आणि रस', 'दही', 'चटणी'], answer: 1 },
    ],
  },
  {
    id: 'paus',
    title: 'पाऊस',
    emoji: '🌧️',
    level: 'सोपी',
    moral: 'निसर्गाचे प्रत्येक रूप महत्त्वाचे असते.',
    pages: [
      'पावसाळ्यात काळे ढग येतात. आकाश गडद होते. वारा जोराने वाहू लागतो.',
      'सर्र सर्र पाऊस पडतो. झाडे आणि शेत हिरवे होतात. जमीन ओली होते.',
      'मुले छत्री घेऊन शाळेत जातात. काही मुले पावसात भिजतात. त्यांना खूप मजा येते.',
      'बेडूक डरायला लागतात. नदी तुडुंब भरते. शेतकरी खूश होतात.',
    ],
    questions: [
      { q: 'पावसाळ्यात आकाश कसे होते?', options: ['निळे', 'लाल', 'गडद', 'पांढरे'], answer: 2 },
      { q: 'मुले शाळेत काय घेऊन जातात?', options: ['पुस्तक', 'छत्री', 'डबा', 'खेळणे'], answer: 1 },
      { q: 'पाऊस पाहून कोण खूश होतात?', options: ['मुले', 'शेतकरी', 'बेडूक', 'पक्षी'], answer: 1 },
    ],
  },
  {
    id: 'aai',
    title: 'माझी आई',
    emoji: '👩‍👧',
    level: 'सोपी',
    moral: 'आईची माया ही जगातील सर्वांत मोठी शक्ती आहे.',
    pages: [
      'माझी आई सकाळी लवकर उठते. ती आमच्यासाठी चहा आणि नाश्ता बनवते. ती खूप मेहनत करते.',
      'आई आमच्यासाठी जेवण बनवते. ती भाजी, पोळी आणि आमटी करते. जेवण खूप चविष्ट असते.',
      'शाळेसाठी आई आम्हाला तयार करते. ती दप्तर भरून देते. आम्हाला वेळेत शाळेत पाठवते.',
      'रात्री आई आम्हाला गोष्टी सांगते. तिचा आवाज खूप गोड आहे. आईशिवाय घर नाही.',
    ],
    questions: [
      { q: 'आई सकाळी काय बनवते?', options: ['भाजी', 'चहा आणि नाश्ता', 'लोणचे', 'दही'], answer: 1 },
      { q: 'आई शाळेसाठी काय भरून देते?', options: ['डबा', 'दप्तर', 'छत्री', 'पाणी'], answer: 1 },
      { q: 'रात्री आई काय करते?', options: ['झोपते', 'स्वयंपाक करते', 'गोष्टी सांगते', 'गाणे गाते'], answer: 2 },
    ],
  },
  {
    id: 'sasa',
    title: 'ससा आणि कासव',
    emoji: '🐢',
    level: 'मध्यम',
    moral: 'सातत्य आणि मेहनत ही वेगापेक्षा जास्त महत्त्वाची आहे.',
    pages: [
      'एक ससा आणि एक कासव होते. ससा खूप वेगाने पळत असे. कासव हळूहळू चालत असे.',
      'एकदा दोघांमध्ये शर्यत ठरली. सशाला खूप अभिमान होता. त्याला वाटले तो नक्की जिंकेल.',
      'शर्यत सुरू झाली. ससा खूप वेगाने पळाला. मध्येच तो थकला आणि झोपला.',
      'कासव हळूहळू चालत राहिले. ते कधीही थांबले नाही. शेवटी कासव आधी पोहोचले आणि जिंकले.',
    ],
    questions: [
      { q: 'ससा का जिंकला नाही?', options: ['त्याला त्रास होता', 'तो झोपला', 'तो हरवला', 'तो घाबरला'], answer: 1 },
      { q: 'शर्यत कोणी जिंकली?', options: ['सशाने', 'दोघांनी', 'कासवाने', 'कोणीच नाही'], answer: 2 },
      { q: 'या गोष्टीतून काय शिकतो?', options: ['वेग महत्त्वाचा', 'सातत्य महत्त्वाचे', 'झोप महत्त्वाची', 'काही नाही'], answer: 1 },
    ],
  },
  {
    id: 'shala',
    title: 'माझी शाळा',
    emoji: '🏫',
    level: 'मध्यम',
    moral: 'शाळा म्हणजे मैत्री, शिकणे आणि आनंद — हे तिघे एकत्र असतात.',
    pages: [
      'मी रोज शाळेत जातो. शाळा आमच्या गावात आहे. शाळेची इमारत मोठी आणि सुंदर आहे.',
      'शाळेत माझे खूप मित्र आहेत. आम्ही वर्गात एकत्र बसतो. एकमेकांना मदत करतो.',
      'सर आम्हाला गणित, मराठी आणि इतर विषय शिकवतात. त्यांचे शिकवणे खूप छान आहे. आम्ही लक्षपूर्वक ऐकतो.',
      'दुपारच्या सुट्टीत आम्ही खेळतो. क्रिकेट, लपाछपी आणि भोवरा खेळतो. शाळेत खूप मजा येते.',
    ],
    questions: [
      { q: 'शाळा कुठे आहे?', options: ['शहरात', 'गावात', 'डोंगरावर', 'नदीजवळ'], answer: 1 },
      { q: 'दुपारच्या सुट्टीत काय करतात?', options: ['झोपतात', 'जेवतात', 'खेळतात', 'अभ्यास करतात'], answer: 2 },
      { q: 'सर काय शिकवतात?', options: ['फक्त गणित', 'गणित, मराठी आणि इतर विषय', 'फक्त मराठी', 'फक्त चित्रकला'], answer: 1 },
    ],
  },

  // ── Tribal context stories ───────────────────────────────────────────────
  {
    id: 'vandevi',
    title: 'वनदेवीची माया',
    emoji: '🌳',
    level: 'मध्यम',
    tribe: 'वारली — पालघर',
    moral: 'जंगल आपले घर आहे — त्याची काळजी घेणे आपली जबाबदारी आहे.',
    pages: [
      'पालघरजवळ वारली गावात राधी नावाची एक मुलगी राहत होती. तिचे घर जंगलाजवळ होते. रोज सकाळी ती जंगलात जाऊन फुले आणि रानफळे गोळा करत असे.',
      'एके दिवशी राधीने एक लहान झाड तोडायला सुरुवात केली. तेवढ्यात एक वृद्ध आजी आली. ती म्हणाली, "मुली थांब! या झाडाला आपल्यासारखाच जीव आहे. हे झाड म्हणजे पक्ष्यांचे घर आहे."',
      'राधीने झाड तोडणे सोडले. आजीने सांगितले की प्रत्येक झाड पाणी देते, हवा देते आणि सावली देते. "झाड नाही तर आपलेही जीवन नाही," असे आजी म्हणाली.',
      'त्या दिवसापासून राधी रोज एक झाड लावू लागली. वर्षांनंतर तिचे गाव हिरव्या झाडांनी भरले. गावकरी तिला प्रेमाने "वनमित्र राधी" म्हणू लागले.',
    ],
    questions: [
      { q: 'राधी जंगलात का जात असे?', options: ['शिकारीसाठी', 'फुले आणि फळे गोळा करण्यासाठी', 'खेळण्यासाठी', 'पाणी आणण्यासाठी'], answer: 1 },
      { q: 'आजीने काय सांगितले?', options: ['झाड लवकर तोड', 'झाडाला जीव आहे', 'जंगलात जाऊ नको', 'झाड विकत घे'], answer: 1 },
      { q: 'गावकरी राधीला काय म्हणत?', options: ['वनराणी', 'वनमित्र', 'जंगलची मुलगी', 'हिरवी परी'], answer: 1 },
    ],
  },
  {
    id: 'melghat',
    title: 'मेळघाटचा मुलगा',
    emoji: '🌿',
    level: 'मध्यम',
    tribe: 'कोरकू — अमरावती',
    moral: 'ज्ञान वाटल्याने ते वाढते — ते स्वतःपुरते ठेवू नये.',
    pages: [
      'मेळघाटच्या डोंगराळ जंगलात आर्यन नावाचा कोरकू मुलगा राहत होता. त्याला जंगलातील प्रत्येक वनस्पती माहीत होती. कोणती वनस्पती आजारात उपयोगी आहे हे त्याने आजीकडून शिकले होते.',
      'एकदा शेजारच्या गावात खूप मुले आजारी पडली. गावात डॉक्टर नव्हता. लोक घाबरले होते. आर्यनला हे कळले.',
      'आर्यनने जंगलात जाऊन विशेष पाने, मुळे आणि रानफळे आणली. त्याच्या आजीने शिकवलेल्या वनौषधींनी काही दिवसांत सर्व मुले बरी झाली. संपूर्ण गाव आनंदित झाले.',
      'त्यानंतर आर्यनने गावातील सर्व मुलांना वनस्पतींची माहिती दिली. तो म्हणाला, "हे ज्ञान आपल्या पूर्वजांनी जपले आहे. ते सर्वांपर्यंत पोहोचवणे आपले काम आहे."',
    ],
    questions: [
      { q: 'आर्यनला हे ज्ञान कोणाकडून मिळाले?', options: ['शाळेत', 'आजीकडून', 'डॉक्टरकडून', 'पुस्तकातून'], answer: 1 },
      { q: 'मुले कशामुळे बरी झाली?', options: ['डॉक्टरकडून', 'आर्यनच्या वनौषधींनी', 'दवाखान्यात', 'विश्रांतीने'], answer: 1 },
      { q: 'या गोष्टीचा धडा काय?', options: ['ज्ञान लपवावे', 'ज्ञान वाटल्याने वाढते', 'जंगलात जाऊ नये', 'डॉक्टर व्हावे'], answer: 1 },
    ],
  },
  {
    id: 'bhil-harin',
    title: 'धनू आणि जखमी हरीण',
    emoji: '🦌',
    level: 'सोपी',
    tribe: 'भिल्ल — नाशिक',
    moral: 'दया हीच खरी शूरता आहे — जखमी जीवाला वाचवणे हे धाडस आहे.',
    pages: [
      'नाशिकजवळ भिल्ल जमातीच्या गावात धनू नावाचा धाडसी मुलगा राहत होता. त्याच्याकडे लहान धनुष्य होते. तो रोज जंगलात जात असे.',
      'एके दिवशी त्याला एक लहान हरीण दिसले. त्याचा पाय जखमी होता. हरीण वेदनेने ओरडत होते आणि उठू शकत नव्हते.',
      'धनूला हरीण पकडायचे होते. पण त्याला त्याची दया आली. त्याने झाडाची पाने आणि वेली वापरून हरणाचा पाय बांधला. रोज येऊन त्याला पाणी आणि गवत दिले.',
      'काही दिवसांनी हरीण बरे झाले आणि जंगलात पळाले. धनू बघत राहिला. तो मनात म्हणाला, "जखमी प्राण्याला मारणे सोपे असते — त्याला वाचवणे हे खरे धाडस आहे."',
    ],
    questions: [
      { q: 'धनूने जंगलात काय पाहिले?', options: ['वाघ', 'जखमी हरीण', 'साप', 'मोर'], answer: 1 },
      { q: 'धनूने हरणाला कशी मदत केली?', options: ['पशुवैद्यकाकडे नेले', 'पाय बांधला व रोज पाणी दिले', 'घरी आणले', 'गावकऱ्यांना सांगितले'], answer: 1 },
      { q: 'धनूने काय शिकले?', options: ['शिकार करायला', 'जखमी प्राण्याला वाचवणे खरे धाडस', 'जंगलात एकटे जाऊ नये', 'हरीण पळते'], answer: 1 },
    ],
  },
  {
    id: 'gond-aaji',
    title: 'आजीचे बी',
    emoji: '🌱',
    level: 'सोपी',
    tribe: 'गोंड — गडचिरोली',
    moral: 'धीर धरल्यावरच फळ मिळते — आत काम चालू असते, बाहेर दिसत नसले तरी.',
    pages: [
      'गडचिरोलीच्या गोंड गावात सानिया आपल्या आजीसोबत राहत होती. एके दिवशी आजीने तिला एक छोटे बी दिले. आजी म्हणाली, "हे जमिनीत लाव आणि रोज पाणी घाल."',
      'सानियाने बी लावले. रोज पाणी घातले. पण एक आठवडा झाला तरी जमिनीतून काहीच उगवले नाही. सानिया निराश झाली. ती आजीजवळ रडत गेली.',
      'आजी हसली आणि म्हणाली, "माती हळूच खणून बघ." सानियाने खणले — तर बी आतून हळूहळू रुजत होते! मुळे खोलवर जात होती. झाड बाहेर येण्यापूर्वी आत तयारी करत होते.',
      'दोन आठवड्यांनंतर एक हिरवे कोंब मातीतून बाहेर आले. सानिया खूश झाली. आजी म्हणाली, "बेटा, माणसाच्या मेहनतीचेही असेच असते — बाहेरून दिसत नसले तरी आत वाढ होत असते."',
    ],
    questions: [
      { q: 'आजीने सानियाला काय दिले?', options: ['खेळणे', 'बी', 'फूल', 'फळ'], answer: 1 },
      { q: 'माती खणल्यावर काय दिसले?', options: ['किडे', 'बी रुजत होते', 'दगड', 'पाणी'], answer: 1 },
      { q: 'आजीच्या गोष्टीचा अर्थ काय?', options: ['मातीत खणू नये', 'मेहनत दिसत नसली तरी चालू असते', 'झाड लवकर वाढते', 'पाणी घालू नये'], answer: 1 },
    ],
  },
  {
    id: 'warli-kala',
    title: 'वारलीची कुंचली',
    emoji: '🎨',
    level: 'कठीण',
    tribe: 'वारली — पालघर',
    moral: 'आपल्या संस्कृतीची कला ही जगाला दिलेली देणगी आहे — तिचा अभिमान बाळगा.',
    pages: [
      'पालघरच्या वारली गावात सुमन नावाची मुलगी राहत होती. तिला चित्रे काढायला खूप आवडायचे. ती भिंतींवर, मातीत, सगळीकडे चित्रे काढत असे. तिच्या चित्रांत झाडे, प्राणी आणि नाच करणारी माणसे असत.',
      'एकदा शहरातून एक शिक्षक गावात आले. त्यांनी सुमनची चित्रे पाहून म्हटले, "ही वारली चित्रकला आहे! ही कला शेकडो वर्षे जुनी आहे. तुमच्या पूर्वजांची ही अमूल्य देणगी आहे."',
      'शिक्षकाने सुमनला शहरात प्रदर्शनात भाग घ्यायला सांगितले. सुमन घाबरली. तिने म्हटले, "मी फक्त गावची मुलगी आहे." तिच्या आईने सांगितले, "तुझी कला तुझी ओळख आहे — घाबरू नकोस."',
      'प्रदर्शनात सुमनची वारली चित्रे बघून सर्वांनी टाळ्या वाजवल्या. लोक म्हणाले, "या चित्रांत निसर्गाचे हृदय आहे." त्या दिवशी सुमनला कळले — आपल्या गावाची संस्कृती ही संपूर्ण जगाची संपत्ती आहे.',
    ],
    questions: [
      { q: 'सुमनच्या चित्रांत काय असे?', options: ['फक्त फुले', 'झाडे, प्राणी आणि नाचणारी माणसे', 'घरे आणि रस्ते', 'फक्त प्राणी'], answer: 1 },
      { q: 'शिक्षकाने कोणत्या कलेचे नाव सांगितले?', options: ['रांगोळी', 'वारली चित्रकला', 'मेंदी', 'मिट्टीकाम'], answer: 1 },
      { q: 'लोकांनी वारली चित्रांबद्दल काय म्हटले?', options: ['खूप सोपी आहे', 'या चित्रांत निसर्गाचे हृदय आहे', 'ही जुनी आहे', 'हे काम नाही'], answer: 1 },
    ],
  },
  {
    id: 'nadi-daan',
    title: 'नदीचे वरदान',
    emoji: '🐟',
    level: 'मध्यम',
    tribe: 'कातकरी — कोकण',
    moral: 'देणे हीच खरी श्रीमंती आहे — नदी सांगते, "मी वाहते म्हणून सर्वांना पाणी मिळते."',
    pages: [
      'कोकणातील एका आदिवासी गावाजवळ एक नदी होती. गावातील गंगू आणि रामू दोन मित्र रोज नदीवर मासे पकडत. गंगू खूप कुशल होता — तो नेहमी जास्त मासे पकडत असे.',
      'एकदा गावात दुष्काळ पडला. अनेक कुटुंबांकडे जेवण नव्हते. गंगूने आपले मासे एकट्याने खाल्ले. रामूने मात्र आपले थोडे मासे जवळपासच्या गरजू कुटुंबांना वाटले.',
      'पुढे पाऊस आला पण गंगूचे जाळे फाटले. त्याच्याकडे नवे जाळे विकत घ्यायला पैसे नव्हते. तो उपाशी राहू लागला.',
      'रामूने त्याला म्हटले, "माझ्यासोबत मासे पकड." गंगूने विचारले, "मी तुझी मदत केली नाही, तू माझी का करतोस?" रामू हसला आणि म्हणाला, "ही नदी सर्वांना देते — मग मी का देऊ नये?"',
    ],
    questions: [
      { q: 'दुष्काळात रामूने काय केले?', options: ['मासे विकले', 'मासे गरजूंना वाटले', 'मासे साठवले', 'मासे टाकून दिले'], answer: 1 },
      { q: 'गंगूची अडचण काय झाली?', options: ['नदी आटली', 'जाळे फाटले व पैसे नव्हते', 'गाव सोडावे लागले', 'आजारी पडला'], answer: 1 },
      { q: 'रामूने काय सांगितले?', options: ['नदी खोल आहे', 'नदी सर्वांना देते', 'माशांची शिकार करू नये', 'जाळे विकत आण'], answer: 1 },
    ],
  },
  {
    id: 'jungle-shala',
    title: 'डोंगरावरची शाळा',
    emoji: '🏔️',
    level: 'कठीण',
    tribe: 'आदिवासी — गडचिरोली',
    moral: 'ज्ञानाचा दिवा सर्वत्र पोहोचला पाहिजे — हाच खरा समाजसेवेचा अर्थ.',
    pages: [
      'गडचिरोलीच्या घनदाट जंगलात एक छोटे आदिवासी गाव होते. गावातील मुले शाळेसाठी खूप लांब पायी चालत जात. रस्ता कच्चा होता; पाऊस आला की चिखल होई.',
      'तिथे रमेश नावाचा एक तरुण शिक्षक आला. त्याने शहरातील चांगली नोकरी सोडून या गावात यायचे ठरवले होते. गावकऱ्यांनी विचारले, "तुम्ही इथे का आलात?" रमेश म्हणाला, "ज्ञानाचा दिवा प्रत्येक कोपऱ्यात पोहोचला पाहिजे."',
      'रमेश सरांनी आंब्याच्या झाडाखाली शाळा भरवली. दगडावर माती घासून फळा बनवला. मुले उत्साहाने शिकू लागली. त्यांनी स्वतः गोंडी भाषेत गाणी आणि कविता लिहिल्या.',
      'दोन वर्षांनंतर गावातील मुलांनी जिल्हा परीक्षेत पहिले स्थान मिळवले. रमेश सर भावुक झाले. मुले म्हणाली, "सर, तुम्ही जंगलात दिवा आणलात." सर म्हणाले, "नाही — तुम्हीच तो दिवा आहात."',
    ],
    questions: [
      { q: 'रमेश सर गावात का आले?', options: ['पैसे कमवायला', 'ज्ञानाचा दिवा सर्वत्र पोहोचवायला', 'सुट्टी घ्यायला', 'घर बांधायला'], answer: 1 },
      { q: 'रमेश सरांनी शाळा कुठे भरवली?', options: ['नदीकाठी', 'आंब्याच्या झाडाखाली', 'मंदिरात', 'घरात'], answer: 1 },
      { q: 'मुलांनी परीक्षेत काय मिळवले?', options: ['दुसरे स्थान', 'जिल्हा परीक्षेत पहिले स्थान', 'बक्षीस', 'शिष्यवृत्ती'], answer: 1 },
    ],
  },
];

// ─── Level badge colours ───────────────────────────────────────────────────
const LEVEL_STYLE: Record<string, string> = {
  'सोपी':   'bg-green-100 text-green-700',
  'मध्यम': 'bg-amber-100 text-amber-700',
  'कठीण':  'bg-rose-100  text-rose-700',
};

function TappableText({ text, onWordTap }: { text: string; onWordTap: (w: string) => void }) {
  const words = text.split(' ');
  return (
    <span>
      {words.map((word, i) => (
        <span key={i}>
          <button
            onClick={() => onWordTap(word.replace(/[।,?!]/g, ''))}
            className="hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-700 rounded px-0.5 transition-colors active:scale-95 cursor-pointer"
          >
            {word}
          </button>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

type Phase = 'list' | 'reading' | 'quiz' | 'result';

export default function StoryReader() {
  const [phase, setPhase] = useState<Phase>('list');
  const [story, setStory] = useState<Story | null>(null);
  const [pageIdx, setPageIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizChosen, setQuizChosen] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [filter, setFilter] = useState<'all' | 'सोपी' | 'मध्यम' | 'कठीण'>('all');

  function startStory(s: Story) {
    setStory(s);
    setPageIdx(0);
    setPhase('reading');
  }

  function speakPage(text: string) {
    if (speaking) return;
    setSpeaking(true);
    speakLetter(text, () => setSpeaking(false));
  }

  function nextPage() {
    if (!story) return;
    if (pageIdx < story.pages.length - 1) {
      setPageIdx(p => p + 1);
    } else {
      setQuizIdx(0);
      setQuizAnswers([]);
      setQuizChosen(null);
      setQuizFeedback(null);
      setPhase('quiz');
    }
  }

  function answerQuiz(optIdx: number) {
    if (quizFeedback || !story) return;
    setQuizChosen(optIdx);
    const correct = optIdx === story.questions[quizIdx].answer;
    setQuizFeedback(correct ? 'correct' : 'wrong');
    const newAnswers = [...quizAnswers, optIdx];
    setTimeout(() => {
      if (quizIdx < story.questions.length - 1) {
        setQuizIdx(i => i + 1);
        setQuizChosen(null);
        setQuizFeedback(null);
        setQuizAnswers(newAnswers);
      } else {
        setQuizAnswers(newAnswers);
        setPhase('result');
      }
    }, 1200);
  }

  function reset() {
    setPhase('list');
    setStory(null);
    setPageIdx(0);
    setSpeaking(false);
  }

  // ─── Story List ──────────────────────────────────────────────────────────
  if (phase === 'list') {
    const visible = filter === 'all' ? STORIES : STORIES.filter(s => s.level === filter);
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-rose-500" />
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg">कथावाचन</h3>
          <span className="ml-auto text-xs text-slate-400 font-semibold">{STORIES.length} गोष्टी</span>
        </div>

        {/* Level filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'सोपी', 'मध्यम', 'कठीण'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                filter === f
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-rose-300'
              }`}>
              {f === 'all' ? 'सर्व' : f}
            </button>
          ))}
        </div>

        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {visible.map(s => (
            <button key={s.id} onClick={() => startStory(s)}
              className="w-full flex items-center gap-4 p-4 bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800/30 transition-all text-left active:scale-[0.98]">
              <span className="text-4xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-800 dark:text-slate-100 text-base truncate">{s.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <p className="text-xs text-slate-400">{s.pages.length} पाने • {s.questions.length} प्रश्न</p>
                  {s.tribe && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 shrink-0">
                      🏕️ {s.tribe}
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-full shrink-0 ${LEVEL_STYLE[s.level]}`}>
                {s.level}
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Reading ─────────────────────────────────────────────────────────────
  if (phase === 'reading' && story) {
    const isLast = pageIdx === story.pages.length - 1;
    const progress = ((pageIdx + 1) / story.pages.length) * 100;

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-rose-100 shadow-sm">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex items-center gap-3">
          <button onClick={reset} className="text-white/70 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-2xl">{story.emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-black text-base leading-tight truncate">{story.title}</h3>
            <div className="flex items-center gap-2">
              <p className="text-rose-100 text-[11px] font-semibold">पान {pageIdx + 1} / {story.pages.length}</p>
              {story.tribe && <span className="text-rose-200 text-[10px]">🏕️ {story.tribe}</span>}
            </div>
          </div>
          <button onClick={() => speakPage(story.pages[pageIdx])} disabled={speaking}
            className={`p-2 rounded-xl transition-all ${speaking ? 'bg-white/20 text-white/50' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
            <Volume2 className={`w-5 h-5 ${speaking ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        <div className="h-1.5 bg-rose-100 dark:bg-rose-900/30">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>

        <div className="p-8 min-h-[200px] flex flex-col justify-center">
          <p className="text-slate-800 dark:text-slate-100 text-xl font-semibold leading-loose text-center">
            <TappableText text={story.pages[pageIdx]} onWordTap={w => speakLetter(w)} />
          </p>
          <p className="text-center text-[11px] text-slate-400 mt-4 font-semibold">
            💡 कोणताही शब्द दाबा — त्याचा उच्चार ऐका
          </p>
        </div>

        <div className="px-6 pb-6 flex justify-between items-center gap-4">
          <button onClick={() => setPageIdx(p => p - 1)} disabled={pageIdx === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition-all text-sm">
            <ChevronLeft className="w-4 h-4" /> मागे
          </button>
          <button onClick={nextPage}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition-all text-sm shadow-md">
            {isLast ? '📝 प्रश्न सोडवा' : <>पुढे <ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz ────────────────────────────────────────────────────────────────
  if (phase === 'quiz' && story) {
    const q = story.questions[quizIdx];
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{story.emoji}</span>
            <span className="font-black text-slate-700 dark:text-slate-200 text-sm">{story.title}</span>
          </div>
          <span className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            प्रश्न {quizIdx + 1}/{story.questions.length}
          </span>
        </div>

        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-5 border border-rose-100 dark:border-rose-800/30">
          <p className="text-slate-800 dark:text-slate-100 font-bold text-lg leading-snug">{q.q}</p>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let cls = 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:border-rose-300';
            if (quizChosen === i) {
              cls = quizFeedback === 'correct'
                ? 'bg-green-100 border-2 border-green-400 text-green-800 scale-[1.02]'
                : 'bg-red-100 border-2 border-red-400 text-red-800';
            } else if (quizFeedback === 'wrong' && i === q.answer) {
              cls = 'bg-green-100 border-2 border-green-400 text-green-800';
            }
            return (
              <button key={i} onClick={() => answerQuiz(i)}
                className={`w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-200 text-sm ${cls}`}>
                <span className="font-black text-slate-400 mr-2">{String.fromCharCode(2309 + i)}.</span> {opt}
              </button>
            );
          })}
        </div>

        {quizFeedback && (
          <div className={`text-center text-lg font-extrabold animate-bounce ${quizFeedback === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {quizFeedback === 'correct' ? '✅ शाब्बास! बरोबर उत्तर!' : `❌ बरोबर उत्तर: "${q.options[q.answer]}"`}
          </div>
        )}
      </div>
    );
  }

  // ─── Result ──────────────────────────────────────────────────────────────
  if (phase === 'result' && story) {
    const correct = quizAnswers.filter((a, i) => a === story.questions[i].answer).length;
    const pct = Math.round((correct / story.questions.length) * 100);
    const medal = pct === 100 ? '🏆' : pct >= 66 ? '🌟' : '💪';

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-rose-100 shadow-sm text-center space-y-5">
        <div className="text-6xl animate-bounce">{medal}</div>
        <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100">{story.title}</h3>
        <p className="text-slate-500 font-semibold">
          {story.questions.length} पैकी{' '}
          <span className="text-rose-600 font-black text-xl">{correct}</span> बरोबर!
        </p>

        <div className="h-4 bg-rose-100 rounded-full overflow-hidden mx-4">
          <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-1000 rounded-full"
            style={{ width: `${pct}%` }} />
        </div>

        {/* Moral callout */}
        {story.moral && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-4 text-left">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-amber-600 mb-1">गोष्टीचा बोध</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{story.moral}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 border border-rose-100 dark:border-rose-800/30 space-y-2">
          {story.questions.map((q, i) => (
            <div key={i} className="flex items-start gap-2 text-left text-sm">
              <span>{quizAnswers[i] === q.answer ? '✅' : '❌'}</span>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">{q.q}</p>
                {quizAnswers[i] !== q.answer && (
                  <p className="text-green-600 text-xs font-bold mt-0.5">बरोबर: {q.options[q.answer]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => { setPageIdx(0); setPhase('reading'); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-rose-600 bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 transition-all text-sm">
            <RotateCcw className="w-4 h-4" /> पुन्हा वाच
          </button>
          <button onClick={reset}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition-all text-sm shadow-md">
            <BookOpen className="w-4 h-4" /> दुसरी गोष्ट
          </button>
        </div>
      </div>
    );
  }

  return null;
}
