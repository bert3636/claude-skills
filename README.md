# claude-skills

Claude skill'lerimin tek listesi. `skills.txt`'te ne varsa bilgisayarımda ve bütün bulut oturumlarımda o kurulu olur.

## Yeni skill eklemek
`skills.txt`'e bir satır ekle, commit'le, push'la. Satır biçimi:

```
<github-repo>  <repo içindeki yol>  [skill adı]
```

Yol `*` ile biterse altındaki her klasör ayrı skill olarak kurulur.
Yol `agents/<ad>.md` ise dosya alt ajan olarak `~/.claude/agents` içine kurulur.

## Bilgisayara kurmak / güncellemek
```bash
curl -sL https://raw.githubusercontent.com/bert3636/claude-skills/main/install.sh | bash
```

## Bulut ortamı (claude.ai/code)
Her ortamın kurulum betiğine şu satırı ekle:
```bash
curl -sL https://raw.githubusercontent.com/bert3636/claude-skills/main/install.sh | bash
```

## Not
- Superpowers bir claude.ai eklentisi, hesaptan geliyor; listede yok.
- Ponytail'in sadece skill'leri kurulur, hook'ları kurulmaz.
- graphify, agent-reach ve shorts ayrıca Python araçları ister (`pip install graphifyy` vb.).
- earshot ayrıca kendi aracını ister: `uv tool install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot"`.
