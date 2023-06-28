require("dotenv").config();
const express = require("express");
const app = express();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  `${process.env.SUPABASE_URL}`,
  `${process.env.SUPABASE_KEY}`
);
const _ = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  const { data: themeData, themeError } = await supabase.from("theme").select();
  const { data: themeSuggestions, themeSuggestionsError } = await supabase
    .from("suggestion_theme")
    .select();
  const { data: suggestionsData, error: suggestionsError } = await supabase
    .from("suggestion")
    .select();
  const { data: latestSuggestionsData, latestSuggestionsError } = await supabase
    .from("suggestion")
    .select()
    .order("created_at", { ascending: false })
    .limit(3);
  const { count, error } = await supabase
    .from("suggestion")
    .select("*", { count: "exact", head: true });
  const { data: residentSuggestionData, residentSuggestionError } =
    await supabase.from("resident_suggestion").select();
  const { data: residentData, residentError } = await supabase
    .from("resident")
    .select();

  for (const latestSuggestion of latestSuggestionsData) {
    for (const residentSuggestion of residentSuggestionData) {
      if (latestSuggestion.id === residentSuggestion.suggestion_id) {
        for (const resident of residentData) {
          if (resident.id === residentSuggestion.resident_id) {
            latestSuggestion.amb = resident;
          }
        }
      }
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const suggestionsWithThemes = [];
  for (let i = 0; i < suggestionsData.length; i++) {
    const suggestion = suggestionsData[i];
    const themeIds = [];
    for (let j = 0; j < themeSuggestions.length; j++) {
      const item = themeSuggestions[j];
      if (item.suggestionId === suggestion.id) {
        themeIds.push(item.themaId);
      }
    }
    const themes = [];
    for (let k = 0; k < themeIds.length; k++) {
      const themeId = themeIds[k];
      let theme = null;
      for (let l = 0; l < themeData.length; l++) {
        const item = themeData[l];
        if (item.id === themeId) {
          theme = item;
          break;
        }
      }
      if (theme) {
        themes.push(theme.label);
      }
    }
    suggestionsWithThemes.push({
      ...suggestion,
      themes: themes,
    });
  }

  const latestsuggestionsWithThemes = [];
  for (let i = 0; i < latestSuggestionsData.length; i++) {
    const suggestion = latestSuggestionsData[i];
    const themeIds = [];
    for (let j = 0; j < themeSuggestions.length; j++) {
      const item = themeSuggestions[j];
      if (item.suggestionId === suggestion.id) {
        themeIds.push(item.themaId);
      }
    }
    const themes = [];
    for (let k = 0; k < themeIds.length; k++) {
      const themeId = themeIds[k];
      let theme = null;
      for (let l = 0; l < themeData.length; l++) {
        const item = themeData[l];
        if (item.id === themeId) {
          theme = item;
          break;
        }
      }
      if (theme) {
        themes.push(theme.label);
      }
    }
    latestsuggestionsWithThemes.push({
      ...suggestion,
      themes: themes,
    });
  }

  // const themeLabels = [];
  // for (let i = 0; i < themeData.length; i++) {
  //   const theme = themeData[i];
  //   themeLabels.push(theme.label);
  // }
  

  shuffleArray(suggestionsWithThemes);

  if (
    themeError ||
    suggestionsError ||
    latestSuggestionsError ||
    themeSuggestionsError
  ) {
    console.error(
      "Error:",
      themeError ||
        suggestionsError ||
        latestSuggestionsError ||
        themeSuggestionsError
    );
  } else {
    res.render("index", {
      title: "Wensen",
      themes: themeData,
      suggestions: suggestionsWithThemes,
      latestSuggestions: latestsuggestionsWithThemes,
      totalSuggestions: count,
    });
  }
});

router.get("/wens/:id", async (req, res) => {
  const suggestionId = req.params.id;
  const { data: suggestionData, error } = await supabase
    .from("suggestion")
    .select()
    .eq("id", suggestionId)
    .single();

  let defaultTime = suggestionData.created_at;
  let date = new Date(defaultTime).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data: residentSuggestionData, residentSuggestionError } =
    await supabase.from("resident_suggestion").select();

  const { data: residentData, residentError } = await supabase
    .from("resident")
    .select();

  const { data: themeData, themeError } = await supabase.from("theme").select();

  const { data: suggestionThemeData, suggestionThemeError } = await supabase
    .from("suggestion_theme")
    .select();

  let listSuggestions = [];
  let theme = [];
  for (const residentSuggestion of residentSuggestionData) {
    for (const resident of residentData) {
      if (residentSuggestion.resident_id === resident.id) {
        if (residentSuggestion.suggestion_id === suggestionData.id) {
          suggestionData.resident = resident;
          listSuggestions.push(suggestionData);
        }
      }
    }
  }

  for (const suggestion of listSuggestions) {
    let relatedThemes = [];
    for (const ts of suggestionThemeData) {
      if (ts.suggestionId === suggestion.id) {
        relatedThemes.push(ts);
      }
    }
    for (const relatedTheme of relatedThemes) {
      for (const t of themeData) {
        if (t.id === relatedTheme.themaId) {
          theme.push(t);
        }
      }
    }
  }

  if (
    error ||
    residentSuggestionError ||
    residentError ||
    themeError ||
    suggestionThemeError
  ) {
    console.error(
      "Error fetching suggestion:",
      error ||
        residentSuggestionError ||
        residentError ||
        themeError ||
        suggestionThemeError
    );
  } else {
    res.render("suggestion", {
      title: "Wens",
      suggestion: suggestionData,
      time: date,
      themes: theme,
    });
  }
});

router.get("/user/:first_name", async (req, res) => {
  const firstName = req.params.first_name;
  const { data: userData, error: userError } = await supabase
    .from("resident")
    .select()
    .eq("first_name", firstName)
    .single();

  let defaultTime = userData.created_at;
  let date = new Date(defaultTime).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { data: residentSuggestionData, residentSuggestionError } =
    await supabase.from("resident_suggestion").select();

  const { data: suggestionData, suggestionError } = await supabase
    .from("suggestion")
    .select();

  let int = 0;
  let listSuggestions = [];
  let theme = [];
  for (const suggestion of suggestionData) {
    for (const residentSuggestion of residentSuggestionData) {
      if (suggestion.id === residentSuggestion.suggestion_id) {
        if (userData.id === residentSuggestion.resident_id) {
          int++;
          listSuggestions.push(suggestion);
        }
      }
    }
  }

  const { data: themeData, themeError } = await supabase.from("theme").select();

  const { data: suggestionThemeData, suggestionThemeError } = await supabase
    .from("suggestion_theme")
    .select();

  for (const suggestion of listSuggestions) {
    let relatedThemes = [];
    for (const ts of suggestionThemeData) {
      if (ts.suggestionId === suggestion.id) {
        relatedThemes.push(ts);
      }
    }
    label = []
    for (const relatedTheme of relatedThemes) {
      for (const theme of themeData) {
        if (relatedTheme.themaId === theme.id) {
          label.push(theme.label);
        }
      }
    }
    suggestion.theme = label;
  }
  if (
    userError ||
    residentSuggestionError ||
    suggestionError ||
    themeError ||
    suggestionThemeError
  ) {
    console.error(
      "Error:",
      userError ||
        residentSuggestionError ||
        suggestionError ||
        themeError ||
        suggestionThemeError
    );
  } else {
    res.render("user", {
      title: "Gebruiker",
      user: userData,
      time: date,
      amount: int,
      suggestions: listSuggestions,
    });
  }
});

router.post("/form", async (req, res) => {
  {
    const { data, error } = await supabase
      .from("suggestion")
      .insert([
        {
          title: req.body.title,
          description: req.body.description,
          image: req.body.imageLink,
        },
      ])
      .select();

    const insertId = data.length > 0 ? data[0].id : null;
    if (error || !insertId) {
      throw error;
    }

    console.log([parseInt(req.body.theme)]);

    const themes = Array.isArray(req.body.theme)
      ? req.body.theme
      : [req.body.theme];

    const themeInsertPromises = themes.map(async (theme) => {
      const { data: themeData, error: themeError } = await supabase
        .from("theme")
        .select("id")
        .eq("id", theme)
        .single();
      if (themeError) {
        throw themeError;
      }

      const { error: suggestionThemeError } = await supabase
        .from("suggestion_theme")
        .insert([
          {
            suggestionId: insertId,
            themeId: themeData.id,
          },
        ]);
      if (suggestionThemeError) {
        console.error("Error:", themeError || suggestionThemeError);
      }
    });

    await Promise.all(themeInsertPromises);
    res.render("sent", { title: "sent" });
  }
  });

  // } catch (error) {
  //   res.status(500).json({
  //     error: "Het toevoegen van de wens ging fout, probeer opnieuw",
  //   });
  //   console.log(error);
  //   return;
  // }
// });

router.get("/sent", (req, res) => {
  res.render("sent", {
    title: "Bevesting",
  });
});

router.get("/form", async (req, res) => {
  const { data: themeData, error: themeError } = await supabase
    .from("theme")
    .select();
  res.render("form", {
    title: "Formulier",
    themes: themeData,
  });
});

router.get("/offline", (req, res) => {
  res.render("offline", {
    title: "Offline",
  });
});

module.exports = router;
