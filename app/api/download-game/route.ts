import { NextRequest, NextResponse } from "next/server";
import { ALL, Item } from "@/lib/sim-data";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Game ID is required", { status: 400 });
  }

  // Find game in ALL
  let game = ALL.find((g) => g.id === id);

  // Fallback match if id has slight variation
  if (!game) {
    const cleanSearchId = id.toLowerCase().replace(/_/g, "-");
    game = ALL.find((g) => g.id.toLowerCase().replace(/_/g, "-") === cleanSearchId);
  }

  // Fallback generic item if still not found
  if (!game) {
    game = {
      id,
      title: id.replace(/[-_]/g, " ").toUpperCase(),
      level: "General",
      subject: "FLN Game",
      emoji: "🎮",
      instructions: [
        "Read the question or challenge on screen.",
        "Select or input the correct answer.",
        "Earn coins for every correct answer!"
      ]
    } as Item;
  }

  let htmlContent = "";

  // 1. Check if a pre-crafted static HTML game exists in public/games/
  const gamesDir = path.join(process.cwd(), "public", "games");
  const possibleNames = [
    `${id}.html`,
    `${id.replace(/^g-/, "")}.html`,
    `${id.replace(/_/g, "-")}.html`,
    `${game.id}.html`
  ];

  let foundPath: string | null = null;
  if (fs.existsSync(gamesDir)) {
    for (const name of possibleNames) {
      const p = path.join(gamesDir, name);
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }
  }

  if (foundPath) {
    try {
      htmlContent = fs.readFileSync(foundPath, "utf-8");
    } catch (err) {
      console.error("Error reading static game file:", err);
    }
  }

  // 2. If no static HTML file exists, generate single-file HTML dynamically
  if (!htmlContent) {
    htmlContent = generateSingleFileHtmlGame(game);
  }

  // 3. Ensure ASCII filename for Content-Disposition header to avoid Node ByteString error (character code > 255)
  const asciiTitle = game.title.replace(/[^a-zA-Z0-9 -]/g, "").trim().replace(/\s+/g, "_") || "FLN_Offline_Game";
  const utf8Filename = encodeURIComponent(game.title);

  return new NextResponse(htmlContent, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${asciiTitle}.html"; filename*=UTF-8''${utf8Filename}.html`,
    },
  });
}

function generateSingleFileHtmlGame(game: Item): string {
  const instructionsList = (game.instructions || []).map((ins) => `<li>${ins}</li>`).join("");
  const safeTitle = game.title.replace(/"/g, "&quot;");
  const safeEmoji = game.emoji || "🎮";
  const safeSubject = game.subject || "FLN Arcade";
  const safeLevel = game.level || "General";
  const gameId = game.id;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} - FLN Offline Game</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
      --accent: #f59e0b;
      --card-bg: rgba(255, 255, 255, 0.96);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Fredoka', cursive, sans-serif; user-select: none; }
    body {
      background: var(--bg-gradient);
      min-height: 100vh;
      color: #0f172a;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
    }
    .header {
      width: 100%;
      max-width: 900px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(12px);
      padding: 16px 24px;
      border-radius: 24px;
      color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.18);
      margin-bottom: 20px;
    }
    .title-area { display: flex; align-items: center; gap: 14px; }
    .title-icon {
      width: 52px;
      height: 52px;
      background: rgba(255,255,255,0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
    }
    .title-text { font-size: 24px; font-weight: 700; line-height: 1.2; }
    .sub-tags { display: flex; gap: 8px; margin-top: 4px; }
    .tag { background: rgba(0,0,0,0.25); padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .stats { display: flex; gap: 12px; font-size: 16px; font-weight: 700; }
    .stat-badge { background: rgba(0,0,0,0.35); padding: 8px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15); color: #fde047; }

    .main-container {
      width: 100%;
      max-width: 900px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .card {
      background: var(--card-bg);
      border-radius: 28px;
      padding: 28px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .instructions-box {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 20px;
      padding: 16px 20px;
    }
    .instructions-title { font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
    .instructions-list { font-size: 14px; color: #334155; line-height: 1.5; padding-left: 20px; }
    .instructions-list li { margin-bottom: 4px; }

    .game-play-area {
      background: #f1f5f9;
      border: 2px dashed #cbd5e1;
      border-radius: 24px;
      padding: 30px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 280px;
      position: relative;
    }

    .question-prompt {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 24px;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      width: 100%;
      max-width: 500px;
    }
    @media(max-width: 600px) {
      .options-grid { grid-template-columns: 1fr; }
    }

    .opt-btn {
      background: white;
      border: 3px solid #cbd5e1;
      color: #1e293b;
      font-size: 22px;
      font-weight: 700;
      padding: 18px 24px;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 6px 12px rgba(0,0,0,0.06);
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .opt-btn:hover { transform: translateY(-3px); border-color: #3b82f6; color: #2563eb; box-shadow: 0 10px 20px rgba(59,130,246,0.2); }
    .opt-btn:active { transform: scale(0.97); }

    .input-box {
      font-size: 28px;
      font-weight: 700;
      text-align: center;
      padding: 12px 20px;
      border-radius: 16px;
      border: 3px solid #cbd5e1;
      width: 160px;
      margin-bottom: 20px;
      outline: none;
    }
    .input-box:focus { border-color: #3b82f6; }

    .btn-submit {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border: none;
      padding: 16px 36px;
      border-radius: 20px;
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.35);
      transition: all 0.2s ease;
    }
    .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(37, 99, 235, 0.45); }
    .btn-submit:active { transform: scale(0.96); }

    .feedback-overlay {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: white;
      padding: 36px 48px;
      border-radius: 32px;
      text-align: center;
      box-shadow: 0 30px 70px rgba(0,0,0,0.6);
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      max-width: 90%;
      width: 420px;
    }
    .feedback-overlay.active { transform: translate(-50%, -50%) scale(1); }
    .feedback-icon { font-size: 72px; margin-bottom: 12px; }

    .footer {
      margin-top: 30px;
      color: rgba(255,255,255,0.5);
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="title-area">
      <div class="title-icon">${safeEmoji}</div>
      <div>
        <div class="title-text">${safeTitle}</div>
        <div class="sub-tags">
          <span class="tag">${safeSubject}</span>
          <span class="tag">Lvl: ${safeLevel}</span>
          <span class="tag">Offline HTML</span>
        </div>
      </div>
    </div>
    <div class="stats">
      <div class="stat-badge">Coins: <span id="score">0</span> 🪙</div>
      <div class="stat-badge">Round: <span id="round">1</span>/10</div>
    </div>
  </div>

  <div class="main-container">
    <div class="card">
      <div class="instructions-box">
        <div class="instructions-title">📋 Instructions / कसे खेळायचे:</div>
        <ul class="instructions-list">
          ${instructionsList}
        </ul>
      </div>

      <div class="game-play-area" id="playArea">
        <!-- Dynamic Game Content loaded by JS -->
      </div>
    </div>
  </div>

  <div class="feedback-overlay" id="feedback">
    <div class="feedback-icon" id="feedbackEmoji">🎉</div>
    <h2 id="feedbackTitle" style="font-size: 28px; margin-bottom: 8px; color: #0f172a;">Great Job!</h2>
    <p id="feedbackText" style="color: #64748b; font-size: 16px; margin-bottom: 24px;">You earned +10 Coins!</p>
    <button class="btn-submit" onclick="nextRound()">NEXT QUESTION ➡️</button>
  </div>

  <div class="footer">
    FLN Games Arcade · Standalone Offline Single-File HTML · Mission FLN
  </div>

  <script>
    const GAME_ID = "${gameId}";
    let round = 1;
    let score = 0;
    let currentCorrectAnswer = null;

    function playSound(isCorrect) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = isCorrect ? 587.33 : 220; // D5 vs A3
        osc.type = isCorrect ? 'sine' : 'sawtooth';
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
      } catch(e){}
    }

    // --- GAME ENGINE ---
    function loadQuestion() {
      document.getElementById('round').innerText = round;
      const area = document.getElementById('playArea');
      area.innerHTML = '';

      if (GAME_ID.includes('market')) {
        renderMarketGame(area);
      } else if (GAME_ID.includes('candy') || GAME_ID.includes('akshar') || GAME_ID.includes('letter')) {
        renderLetterGame(area);
      } else if (GAME_ID.includes('word') || GAME_ID.includes('sent') || GAME_ID.includes('story') || GAME_ID.includes('vachan') || GAME_ID.includes('rhyme') || GAME_ID.includes('missing')) {
        renderLiteracyGame(area);
      } else if (GAME_ID.includes('abacus') || GAME_ID.includes('bundle') || GAME_ID.includes('place') || GAME_ID.includes('sankhya') || GAME_ID.includes('tili')) {
        renderPlaceValueGame(area);
      } else if (GAME_ID.includes('clock')) {
        renderClockGame(area);
      } else if (GAME_ID.includes('waste') || GAME_ID.includes('plate') || GAME_ID.includes('germ') || GAME_ID.includes('empathy') || GAME_ID.includes('buddy') || GAME_ID.includes('routine')) {
        renderLifeSkillsGame(area);
      } else {
        renderMathGame(area);
      }
    }

    // --- 1. MATH & NUMERACY ENGINE ---
    function renderMathGame(area) {
      const ops = ['+', '-', '×'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let n1, n2, ans;

      if (op === '+') {
        n1 = Math.floor(Math.random() * 20) + 1;
        n2 = Math.floor(Math.random() * 20) + 1;
        ans = n1 + n2;
      } else if (op === '-') {
        n1 = Math.floor(Math.random() * 20) + 10;
        n2 = Math.floor(Math.random() * n1) + 1;
        ans = n1 - n2;
      } else {
        n1 = Math.floor(Math.random() * 9) + 2;
        n2 = Math.floor(Math.random() * 9) + 2;
        ans = n1 * n2;
      }

      currentCorrectAnswer = ans;

      let options = [ans];
      while(options.length < 4) {
        let wrg = ans + (Math.floor(Math.random() * 10) - 5);
        if (wrg > 0 && !options.includes(wrg)) options.push(wrg);
      }
      options.sort(() => Math.random() - 0.5);

      const html = \`
        <div class="question-prompt">\${n1} \${op} \${n2} = ?</div>
        <div class="options-grid">
          \${options.map(opt => \`<button class="opt-btn" onclick="checkChoice(\${opt})">\${opt}</button>\`).join('')}
        </div>
      \`;
      area.innerHTML = html;
    }

    // --- 2. MARKET MATH ENGINE ---
    let marketPaid = 0;
    let marketTarget = 0;
    function renderMarketGame(area) {
      marketPaid = 0;
      const items = [
        { name: 'Apple 🍎', price: 10 },
        { name: 'Mango 🥭', price: 20 },
        { name: 'Banana 🍌', price: 5 },
        { name: 'Pencil ✏️', price: 15 },
        { name: 'Book 📓', price: 30 }
      ];
      const i1 = items[Math.floor(Math.random() * items.length)];
      let i2 = items[Math.floor(Math.random() * items.length)];
      while(i2 === i1) i2 = items[Math.floor(Math.random() * items.length)];
      marketTarget = i1.price + i2.price;
      currentCorrectAnswer = marketTarget;

      const html = \`
        <div style="font-size:48px; margin-bottom:8px;">👧</div>
        <div class="question-prompt" style="font-size:22px;">"Please give me \${i1.name} (₹\${i1.price}) & \${i2.name} (₹\${i2.price})!"</div>
        <div style="font-size:24px; font-weight:700; color:#059669; margin-bottom:16px;">
          Paid: ₹<span id="marketPaidVal">0</span> / Target: ₹\${marketTarget}
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; justify-center; margin-bottom:20px;">
          <button class="opt-btn" style="padding:10px 18px;" onclick="addMarketMoney(1)">+ ₹1</button>
          <button class="opt-btn" style="padding:10px 18px;" onclick="addMarketMoney(5)">+ ₹5</button>
          <button class="opt-btn" style="padding:10px 18px;" onclick="addMarketMoney(10)">+ ₹10</button>
          <button class="opt-btn" style="padding:10px 18px;" onclick="addMarketMoney(20)">+ ₹20</button>
          <button class="opt-btn" style="padding:10px 18px;" onclick="addMarketMoney(50)">+ ₹50</button>
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn-submit" onclick="checkChoice(marketPaid)">CHECK PAYMENT ✅</button>
          <button class="btn-submit" style="background:#ef4444;" onclick="resetMarketPaid()">CLEAR 🔄</button>
        </div>
      \`;
      area.innerHTML = html;
    }

    function addMarketMoney(amt) {
      marketPaid += amt;
      const el = document.getElementById('marketPaidVal');
      if (el) el.innerText = marketPaid;
    }
    function resetMarketPaid() {
      marketPaid = 0;
      const el = document.getElementById('marketPaidVal');
      if (el) el.innerText = '0';
    }

    // --- 3. LETTER & AKSHAR ENGINE ---
    function renderLetterGame(area) {
      const akshars = ['क', 'म', 'ल', 'र', 'स', 'न', 'त', 'ब', 'प', 'ग', 'घ', 'च'];
      const target = akshars[Math.floor(Math.random() * akshars.length)];
      currentCorrectAnswer = target;

      let choices = [target];
      while(choices.length < 4) {
        let rand = akshars[Math.floor(Math.random() * akshars.length)];
        if (!choices.includes(rand)) choices.push(rand);
      }
      choices.sort(() => Math.random() - 0.5);

      const html = \`
        <div class="question-prompt">अक्षर ओळखा (Find Letter): <span style="color:#ec4899; font-size:48px;">\${target}</span></div>
        <div class="options-grid">
          \${choices.map(c => \`<button class="opt-btn" style="font-size:36px;" onclick="checkChoice('\${c}')">\${c}</button>\`).join('')}
        </div>
      \`;
      area.innerHTML = html;
    }

    // --- 4. LITERACY & STORY ENGINE ---
    function renderLiteracyGame(area) {
      const questions = [
        { q: 'कमल _____ बघ.', ans: 'फुल', opts: ['फुल', 'दगड', 'झाड', 'नदी'] },
        { q: 'पाण्यात कोण पोहते?', ans: 'मासा', opts: ['मासा', 'मांजरा', 'कुत्रा', 'पक्षी'] },
        { q: 'आकाशात काय चमकते?', ans: 'चांदण्या', opts: ['चांदण्या', 'झाड', 'दगड', 'घर'] },
        { q: 'ससा काय खातो?', ans: 'गाजर', opts: ['गाजर', 'मासा', 'दूध', 'भाजी'] },
        { q: 'आपण डोळ्यांनी काय करतो?', ans: 'पाहतो', opts: ['पाहतो', 'ऐकतो', 'खातो', 'चालतो'] }
      ];
      const item = questions[Math.floor(Math.random() * questions.length)];
      currentCorrectAnswer = item.ans;

      const html = \`
        <div class="question-prompt" style="font-size:26px;">\${item.q}</div>
        <div class="options-grid">
          \${item.opts.map(opt => \`<button class="opt-btn" onclick="checkChoice('\${opt}')">\${opt}</button>\`).join('')}
        </div>
      \`;
      area.innerHTML = html;
    }

    // --- 5. PLACE VALUE ENGINE ---
    function renderPlaceValueGame(area) {
      const num = Math.floor(Math.random() * 899) + 100; // 100 to 999
      const h = Math.floor(num / 100);
      const t = Math.floor((num % 100) / 10);
      const o = num % 10;
      currentCorrectAnswer = num;

      let choices = [num];
      while(choices.length < 4) {
        let wrg = num + (Math.floor(Math.random() * 10) - 5) * 10;
        if (wrg > 0 && !choices.includes(wrg)) choices.push(wrg);
      }
      choices.sort(() => Math.random() - 0.5);

      const html = \`
        <div class="question-prompt" style="font-size:24px;">
          \${h} शतक (Hundreds) + \${t} दशक (Tens) + \${o} एकक (Units) = ?
        </div>
        <div class="options-grid">
          \${choices.map(c => \`<button class="opt-btn" onclick="checkChoice(\${c})">\${c}</button>\`).join('')}
        </div>
      \`;
      area.innerHTML = html;
    }

    // --- 6. CLOCK GAME ENGINE ---
    function renderClockGame(area) {
      const hours = Math.floor(Math.random() * 12) + 1;
      const timeStr = \`\${hours}:00\`;
      currentCorrectAnswer = timeStr;

      let choices = [timeStr];
      while(choices.length < 4) {
        let h = Math.floor(Math.random() * 12) + 1;
        let t = \`\${h}:00\`;
        if (!choices.includes(t)) choices.push(t);
      }
      choices.sort(() => Math.random() - 0.5);

      const html = \`
        <div style="font-size:56px; margin-bottom:8px;">⏰</div>
        <div class="question-prompt">घड्याळात \${hours} वाजल आहेत! (Select Time)</div>
        <div class="options-grid">
          \${choices.map(c => \`<button class="opt-btn" onclick="checkChoice('\${c}')">\${c}</button>\`).join('')}
        </div>
      \`;
      area.innerHTML = html;
    }

    // --- 7. LIFE SKILLS & HABITS ENGINE ---
    function renderLifeSkillsGame(area) {
      const scenarios = [
        { q: 'जेवणाआधी काय करावे?', ans: 'हात धुवावेत 🧼', opts: ['हात धुवावेत 🧼', 'खेळायला जावे ⚽', 'झोपावे 😴', 'टीव्ही पहावा 📺'] },
        { q: 'ओला कचरा कोणत्या डब्यात टाकावा?', ans: 'हिरवा डबा 🟢', opts: ['हिरवा डबा 🟢', 'निळा डबा 🔵', 'रस्त्यावर 🛣️', 'नदीत 🌊'] },
        { q: 'मित्र पडला तर काय कराल?', ans: 'मदत करू 🤝', opts: ['मदत करू 🤝', 'हसू 😆', 'पळून जाऊ 🏃', 'रागवू 😡'] },
        { q: 'रोज सकाळी काय केले पाहिजे?', ans: 'दात घासावेत 🪥', opts: ['दात घासावेत 🪥', 'चॉकलेट खावे 🍫', 'भांडण करावे 👊', 'उशिरा उठावे ⏰'] }
      ];
      const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
      currentCorrectAnswer = sc.ans;

      const html = \`
        <div class="question-prompt" style="font-size:24px;">\${sc.q}</div>
        <div class="options-grid">
          \${sc.opts.map(opt => \`<button class="opt-btn" style="font-size:18px;" onclick="checkChoice('\${opt}')">\${opt}</button>\`).join('')}
        </div>
      \`;
      area.innerHTML = html;
    }

    // --- CHECK CHOICE ---
    function checkChoice(userVal) {
      const fb = document.getElementById('feedback');
      const isRight = (String(userVal) === String(currentCorrectAnswer));

      playSound(isRight);

      if (isRight) {
        score += 10;
        document.getElementById('score').innerText = score;
        document.getElementById('feedbackEmoji').innerText = '🎉';
        document.getElementById('feedbackTitle').innerText = 'अतिउत्तम! Correct!';
        document.getElementById('feedbackText').innerText = 'You earned +10 Coins! 🪙';
      } else {
        document.getElementById('feedbackEmoji').innerText = '❌';
        document.getElementById('feedbackTitle').innerText = 'पुन्हा प्रयत्न करा!';
        document.getElementById('feedbackText').innerText = \`Correct answer was: \${currentCorrectAnswer}\`;
      }
      fb.classList.add('active');
    }

    function nextRound() {
      document.getElementById('feedback').classList.remove('active');
      round++;
      if (round > 10) {
        alert(\`🎉 Game Completed! Total Score: \${score} Coins! 🪙\`);
        round = 1;
        score = 0;
        document.getElementById('score').innerText = score;
      }
      loadQuestion();
    }

    window.onload = loadQuestion;
  </script>
</body>
</html>`;
}
