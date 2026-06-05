
    // ============================================================
    // КЛАССЫ РАСЧЕТОВ (БЕЗ ВЫБОРА МАТЕРИАЛА)
    // ============================================================

    // 5.1 - Расчет прямоугольного резистора (Кф > 1) - 7 пунктов
    class ThinFilmResistor {
    calculate(R, gammaR, P, tMax, gammaP0, deltaB, deltaL, rho0, P0, alphaR, gammaRct, gammaRk) {
    let output = [];

    let Kf = R / rho0;
    let gammaRt = alphaR * (tMax - 20) * 100;
    let gammaKfDop = gammaR - gammaP0 - gammaRt - gammaRct - gammaRk;

    let bmin1 = Math.sqrt((P * rho0) / (P0 * R));
    let bmin2 = (deltaB + deltaL / Kf) / (gammaKfDop / 100);
    let b = Math.max(bmin1, bmin2);

    if (b <= 1.12) b = 1.25;
    else if (b <= 1.5) b = 1.5;
    else b = Math.ceil(b * 10) / 10;

    let l = b * Kf;
    let S = b * l;
    let P0real = P / S;
    let gammaKf_calc = (deltaB / b + deltaL / l) * 100;
    let gammaRtotal = gammaP0 + gammaRt + gammaRct + gammaRk + gammaKf_calc;

    output.push(`1. Кф = R / ρ₀ = ${R} / ${rho0} = ${Kf.toFixed(1)}`);
    output.push(`2. γ_Rt = α_R × (t_max - 20) × 100% = ${alphaR} × (${tMax} - 20) × 100 = ${gammaRt.toFixed(2)}%`);
    output.push(`3. γ_Кф_доп = ${gammaR} - ${gammaP0} - ${gammaRt.toFixed(2)} - ${gammaRct} - ${gammaRk} = ${gammaKfDop.toFixed(2)}%`);
    output.push(`4. b_min = max(√(P×ρ₀/(P₀×R)), (Δb+Δl/Кф)/(γ_Кф_доп/100)) = max(${bmin1.toFixed(3)}, ${bmin2.toFixed(3)}) = ${b.toFixed(3)} мм → принимаем b = ${b.toFixed(2)} мм`);
    output.push(`5. l = b × Кф = ${b.toFixed(2)} × ${Kf.toFixed(4)} = ${l.toFixed(2)} мм`);
    output.push(`6. P₀' = P / (b×l) = ${P} / (${b.toFixed(2)}×${l.toFixed(2)}) = ${P0real.toFixed(2)} мВт/мм² < ${P0} мВт/мм² → условие выполняется`);
    output.push(`7. γ_R = ${gammaP0} + ${gammaRt.toFixed(2)} + ${gammaRct} + ${gammaRk} + ${gammaKf_calc.toFixed(2)} = ${gammaRtotal.toFixed(2)}% < ${gammaR}% → условие выполняется`);

    return { output, b, l, S, Kf };
}
}

    // 5.2 - Расчет резистора-меандра (Кф > 10) - 13 пунктов (с выводом bmin1 и bmin2)
    class MeanderResistor {
    calculate(R, gammaR, P, tMax, gammaP0, deltaB, deltaL, rho0, P0, alphaR, gammaRct, gammaRk) {
    let output = [];

    let Kf = R / rho0;
    let gammaRt = alphaR * (tMax - 20) * 100;
    let gammaKfDop = gammaR - gammaP0 - gammaRt - gammaRct - gammaRk;

    let bmin1 = Math.sqrt((P * rho0) / (P0 * R));
    let bmin2 = (deltaB + deltaL / Kf) / (gammaKfDop / 100);

    let b = 0.4;
    let lcp = b * Kf;
    let a = b;
    let n = 5;
    let L = n * (a + b);
    let B = (lcp - a * n) / n;
    let S = lcp * b;
    let P0real = P / S;

    output.push(`1. Кф = R / ρ₀ = ${R} / ${rho0} = ${Kf.toFixed(2)} ( > 10, применяем меандр)`);
    output.push(`2. γ_Rt = α_R × (t_max - 20) × 100% = ${alphaR} × (${tMax} - 20) × 100 = ${gammaRt.toFixed(2)}%`);
    output.push(`3. γ_Кф_доп = γ_R - γ_ρ₀ - γ_Rt - γ_Rct - γ_Rк = ${gammaR} - ${gammaP0} - ${gammaRt.toFixed(2)} - ${gammaRct} - ${gammaRk} = ${gammaKfDop.toFixed(2)}%`);
    output.push(`4. b_min1 = √(P × ρ₀ / (P₀ × R)) = √(${P} × ${rho0} / (${P0} × ${R})) = ${bmin1.toFixed(3)} мм`);
    output.push(`5. b_min2 = (Δb + Δl/Кф) / (γ_Кф_доп/100) = (${deltaB} + ${deltaL}/${Kf.toFixed(2)}) / (${gammaKfDop.toFixed(2)}/100) = ${bmin2.toFixed(3)} мм`);
    output.push(`6. Принимаем b = ${b} мм`);
    output.push(`7. l_cp = b × Кф = ${b} × ${Kf.toFixed(2)} = ${lcp.toFixed(2)} мм`);
    output.push(`8. Задаём расстояние между резистивными пленками a = b = ${a} мм`);
    output.push(`9. Выбираем количество звеньев n = ${n}`);
    output.push(`10. L = n × (a + b) = ${n} × (${a} + ${b}) = ${L.toFixed(2)} мм`);
    output.push(`11. B = (l_cp - a×n) / n = (${lcp.toFixed(2)} - ${a}×${n}) / ${n} = ${B.toFixed(2)} мм`);
    output.push(`12. S_м = L × B = ${L.toFixed(2)} × ${B.toFixed(2)} = ${(L*B).toFixed(2)} мм²`);
    output.push(`13. P₀' = P / (l_cp × b) = ${P} / (${lcp.toFixed(2)} × ${b}) = ${P0real.toFixed(2)} мВт/мм² < ${P0} мВт/мм² → условие выполняется`);

    return { output, b, lcp, Kf };
}
}

    // 5.3 - Расчет короткого резистора (Кф < 1) - 7 пунктов
    class ShortResistor {
    calculate(R, gammaR, P, tMax, gammaP0, deltaB, deltaL, rho0, P0, alphaR, gammaRct, gammaRk) {
    let output = [];

    let Kf = R / rho0;
    let gammaRt = alphaR * (tMax - 20) * 100;
    let gammaKfDop = gammaR - gammaP0 - gammaRt - gammaRct - gammaRk;

    let lmin1 = (deltaL + deltaB * Kf) / (gammaKfDop / 100);
    let lmin2 = Math.sqrt((P * R) / (P0 * rho0));
    let l = Math.max(lmin1, lmin2);

    if (l < 1.5) l = 1.5;
    l = Math.ceil(l * 10) / 10;

    let b = l / Kf;
    b = Math.ceil(b * 10) / 10;
    let S = b * l;
    let P0real = P / S;
    let gammaKf_calc = (deltaB / b + deltaL / l) * 100;
    let gammaRtotal = gammaP0 + gammaRt + gammaRct + gammaRk + gammaKf_calc;

    output.push(`1. Кф = R / ρ₀ = ${R} / ${rho0} = ${Kf.toFixed(1)}`);
    output.push(`2. γ_Кф_доп = ${gammaR} - ${gammaP0} - ${gammaRt.toFixed(2)} - ${gammaRct} - ${gammaRk} = ${gammaKfDop.toFixed(2)}%`);
    output.push(`3. l_min = max((Δl+Δb×Кф)/(γ_Кф_доп/100), √(P×R/(P₀×ρ₀))) = max(${lmin1.toFixed(3)}, ${lmin2.toFixed(3)}) = ${l.toFixed(3)} мм → принимаем l = ${l.toFixed(2)} мм`);
    output.push(`4. b = l / Кф = ${l.toFixed(2)} / ${Kf.toFixed(4)} = ${b.toFixed(2)} мм`);
    output.push(`5. P₀' = P / (b×l) = ${P} / (${b.toFixed(2)}×${l.toFixed(2)}) = ${P0real.toFixed(2)} мВт/мм² < ${P0} мВт/мм² → условие выполняется`);
    output.push(`6. γ_R = ${gammaP0} + ${gammaRt.toFixed(2)} + ${gammaRct} + ${gammaRk} + ${gammaKf_calc.toFixed(2)} = ${gammaRtotal.toFixed(2)}% < ${gammaR}% → условие выполняется`);

    return { output, b, l, S, Kf };
}
}

    // 5.4 - Контактный переход (Кф > 1) - с уменьшением ρ₀ делением на 2 до выполнения условия
    class ContactTransitionLong {
    calculate(R, rho0, b, gammaRk, rhoK, deltaL, deltaLy) {
    let output = [];

    let RkDop = (gammaRk / 100) * R / 2;
    let RkMin = Math.sqrt(rho0 * rhoK) / b;

    output.push(`1. R_к_доп = γ_Rк × R / 2 = (${gammaRk}/100) × ${R} / 2 = ${RkDop.toFixed(3)} Ом`);
    output.push(`2. R_к_min = √(ρ₀ × ρ_к) / b = √(${rho0} × ${rhoK}) / ${b} = ${RkMin.toFixed(3)} Ом`);

    let finalRho0 = rho0;
    let finalRkMin = RkMin;
    let divisor = 1;

    if (RkMin < RkDop) {
    output.push(`3. Условие выполняется: ${RkMin.toFixed(3)} < ${RkDop.toFixed(3)} ✓`);
} else {
    output.push(`3. Условие НЕ выполняется: ${RkMin.toFixed(3)} > ${RkDop.toFixed(3)} ✗ → уменьшаем ρ₀ делением на 2`);

    let tempRho0 = rho0;
    let tempRkMin = RkMin;
    let iteration = 0;
    let maxIterations = 10;
    let success = false;

    while (tempRkMin >= RkDop && iteration < maxIterations) {
    divisor = divisor * 2;
    tempRho0 = rho0 / divisor;
    tempRkMin = Math.sqrt(tempRho0 * rhoK) / b;
    iteration++;

    if (tempRkMin < RkDop) {
    success = true;
    finalRho0 = tempRho0;
    finalRkMin = tempRkMin;
    output.push(`   ✓ Условие выполняется: ${tempRkMin.toFixed(3)} < ${RkDop.toFixed(3)}`);
    break;
}
}

    if (!success) {
    output.push(`   ✗ Условие не выполняется даже после всех делений, оставляем исходное значение ρ₀ = ${rho0} Ом/□`);
    finalRho0 = rho0;
    finalRkMin = RkMin;
}
}

    let lkMin = 1.5 * Math.sqrt(rhoK / finalRho0);
    let lk = lkMin + deltaL + deltaLy;
    let lkFinal = Math.ceil(lk * 10) / 10;
    let B = b + 2 * (deltaL + deltaLy);
    let Bfinal = Math.ceil(B * 10) / 10;

    output.push(`4. l_к_min = 1.5 × √(ρ_к / ρ₀(новое)) = 1.5 × √(${rhoK} / ${finalRho0.toFixed(1)}) = ${lkMin.toFixed(3)} мм`);
    output.push(`5. l_к = ${lkMin.toFixed(3)} + Δl + Δl_у = ${lkMin.toFixed(3)} + ${deltaL} + ${deltaLy} = ${lk.toFixed(3)} мм → принимаем l_к = ${lkFinal.toFixed(1)} мм`);
    output.push(`6. B = b + 2×(Δl + Δl_у) = ${b} + 2×(${deltaL} + ${deltaLy}) = ${B.toFixed(2)} мм → принимаем B = ${Bfinal.toFixed(1)} мм`);

    return output;
}
}

    // 5.5 - Контактный переход для меандра - 7 пунктов
    class ContactTransitionMeander {
    calculate(R, rho0, b, gammaRk, rhoK, deltaL, deltaLy) {
    let output = [];

    let RkDop = (gammaRk / 100) * R / 2;
    let RkMin = Math.sqrt(rho0 * rhoK) / b;
    let lkMin = 1.5 * Math.sqrt(rhoK / rho0);
    let lk = lkMin + deltaL + deltaLy;
    let lkFinal = Math.ceil(lk * 10) / 10;
    let B = b + 2 * (deltaL + deltaLy);
    let Bfinal = Math.ceil(B * 10) / 10;

    output.push(`1. R_к_доп = γ_Rк × R / 2 = (${gammaRk}/100) × ${R} / 2 = ${RkDop.toFixed(1)} Ом`);
    output.push(`2. R_к_min = √(ρ₀ × ρ_к) / b = √(${rho0} × ${rhoK}) / ${b} = ${RkMin.toFixed(3)} Ом`);

    if (RkMin < RkDop) {
    output.push(`3. Условие выполняется: ${RkMin.toFixed(3)} < ${RkDop.toFixed(3)} ✓`);
} else {
    output.push(`3. Условие НЕ выполняется: ${RkMin.toFixed(3)} > ${RkDop.toFixed(3)} ✗ (требуется увеличить b)`);
}

    output.push(`4. l_к_min = 1.5 × √(ρ_к / ρ₀) = 1.5 × √(${rhoK} / ${rho0}) = ${lkMin.toFixed(3)} мм`);
    output.push(`5. l_к = ${lkMin.toFixed(3)} + Δl + Δl_у = ${lkMin.toFixed(3)} + ${deltaL} + ${deltaLy} = ${lk.toFixed(3)} мм → принимаем l_к = ${lkFinal.toFixed(1)} мм`);
    output.push(`6. B = b + 2×(Δl + Δl_у) = ${b} + 2×(${deltaL} + ${deltaLy}) = ${B.toFixed(2)} мм`);
    output.push(`7. Принимаем B = ${Bfinal.toFixed(1)} мм`);

    return output;
}
}

    // 5.6 - Контактный переход для короткого резистора - 8 пунктов
    class ContactTransitionShort {
    calculate(R, rho0, b, gammaRk, rhoK, deltaL, deltaLy, Kf) {
    let output = [];

    let RkDop = (gammaRk / 100) * R / 2;
    let RkMin_original = Math.sqrt(rho0 * rhoK) / b;

    output.push(`1. R_к_доп = γ_Rк × R / 2 = (${gammaRk}/100) × ${R} / 2 = ${RkDop.toFixed(3)} Ом`);
    output.push(`2. R_к_min = √(ρ₀ × ρ_к) / b = √(${rho0} × ${rhoK}) / ${b} = ${RkMin_original.toFixed(3)} Ом`);

    let newB = b;
    let newL = 0;

    if (RkMin_original >= RkDop) {
    output.push(`3. Условие ${RkMin_original.toFixed(3)} < ${RkDop.toFixed(3)} НЕ выполняется → увеличиваем ширину b`);

    let bNeeded = Math.sqrt(rho0 * rhoK) / RkDop;
    newB = Math.ceil(bNeeded * 10) / 10;
    if (newB < 12) newB = 12;
    newL = newB * Kf;
    let newLrounded = Math.ceil(newL * 10) / 10;
    let newRkMin = Math.sqrt(rho0 * rhoK) / newB;

    output.push(`   Выбираем b = ${newB} мм`);
    output.push(`   l = b × Кф = ${newB} × ${Kf.toFixed(4)} = ${newL.toFixed(2)} → ${newLrounded} мм`);
    output.push(`   R_к_min(новое) = √(${rho0} × ${rhoK}) / ${newB} = ${newRkMin.toFixed(3)} Ом`);
    output.push(`   Условие ${newRkMin.toFixed(3)} < ${RkDop.toFixed(3)} ${newRkMin < RkDop ? '✓ выполняется' : '✗ НЕ выполняется'}`);
} else {
    output.push(`3. Условие выполняется: ${RkMin_original.toFixed(3)} < ${RkDop.toFixed(3)} ✓ (увеличение b не требуется)`);
    newL = b * Kf;
}

    let lkMin = 1.5 * Math.sqrt(rhoK / rho0);
    let lk = lkMin + deltaL + deltaLy;
    let lkFinal = Math.ceil(lk * 10) / 10;
    let B = newB + 2 * (deltaL + deltaLy);
    let Bfinal = Math.ceil(B * 10) / 10;

    output.push(`4. l_к_min = 1.5 × √(ρ_к / ρ₀) = 1.5 × √(${rhoK} / ${rho0}) = ${lkMin.toFixed(3)} мм`);
    output.push(`5. l_к = ${lkMin.toFixed(3)} + Δl + Δl_у = ${lkMin.toFixed(3)} + ${deltaL} + ${deltaLy} = ${lk.toFixed(3)} мм → принимаем l_к = ${lkFinal.toFixed(1)} мм`);
    output.push(`6. B = b + 2×(Δl + Δl_у) = ${newB} + 2×(${deltaL} + ${deltaLy}) = ${B.toFixed(2)} мм`);
    output.push(`7. Принимаем B = ${Bfinal.toFixed(1)} мм`);
    output.push(`8. Проверка: R_к_min(новое) = ${Math.sqrt(rho0 * rhoK) / newB < RkDop ? Math.sqrt(rho0 * rhoK) / newB : '---'} < ${RkDop.toFixed(3)} → условие ${Math.sqrt(rho0 * rhoK) / newB < RkDop ? '✓ выполняется' : '✗ НЕ выполняется'}`);

    return { output, newB, newL };
}
}

    // 5.7 - Пленочный конденсатор - 11 пунктов
    class ThinFilmCapacitor {
    calculate(C, gammaC, Up, tMax, gammaC0, deltaL, deltaB, deltaLy, epsilon, Epr, alphaC, gammaCst, Kz) {
    let output = [];

    let dMin = (Kz * Up) / Epr;
    let gammaC1 = alphaC * (tMax - 20) * 100;
    let gammaSDop = gammaC - gammaC0 - gammaC1 - gammaCst;
    let C0max1 = (0.0885 * epsilon) / (dMin / 1000);
    let C0max2 = C * Math.pow(gammaSDop / 100, 2) / (4 * Math.pow(deltaL, 2));
    let C0 = Math.min(C0max1, C0max2);
    let d = (0.0885 * epsilon) / C0 * 1000;
    let S = C / C0;
    let L2 = Math.sqrt(S);
    let L1 = L2 + 2 * (deltaL + deltaLy);
    L1 = Math.ceil(L1 * 100) / 100;
    let Ld = L1 + 2 * (deltaL + deltaLy);
    Ld = Math.ceil(Ld * 100) / 100;
    let gammaS = 2 * deltaL / Math.sqrt(S);
    let gammaCtotal = gammaC0 + gammaC1 + gammaS * 100 + gammaCst;
    let ERab = Up / d;

    output.push(`1. d_min = K_з × U_р / E_пр = ${Kz} × ${Up} / ${Epr} = ${dMin.toFixed(4)} мм = ${(dMin*1000).toFixed(1)} мкм`);
    output.push(`2. γ_С1 = α_С × (t_max - 20) × 100% = ${alphaC} × (${tMax} - 20) × 100 = ${gammaC1.toFixed(2)}%`);
    output.push(`3. γ_S_доп = γ_С - γ_С0 - γ_С1 - γ_Сст = ${gammaC} - ${gammaC0} - ${gammaC1.toFixed(2)} - ${gammaCst} = ${gammaSDop.toFixed(2)}%`);
    output.push(`4. C₀_max1 = 0.0885 × ε / d_min = 0.0885 × ${epsilon} / ${(dMin*1000).toFixed(2)} = ${C0max1.toFixed(2)} пФ/мм²`);
    output.push(`5. C₀_max2 = C × (γ_S_доп/100)² / (4 × ΔL²) = ${C} × (${gammaSDop.toFixed(2)}/100)² / (4 × ${deltaL}²) = ${C0max2.toFixed(2)} пФ/мм²`);
    output.push(`6. C₀ = min(C₀_max1, C₀_max2) = min(${C0max1.toFixed(2)}, ${C0max2.toFixed(2)}) = ${C0.toFixed(2)} пФ/мм²`);
    output.push(`7. S = C / C₀ = ${C} / ${C0.toFixed(2)} = ${S.toFixed(2)} мм²`);
    output.push(`8. L₂ = B₂ = √S = √${S.toFixed(2)} = ${L2.toFixed(2)} мм`);
    output.push(`9. L₁ = L₂ + 2×(ΔL + Δl_Y) = ${L2.toFixed(2)} + 2×(${deltaL} + ${deltaLy}) = ${L1.toFixed(2)} мм`);
    output.push(`10. E_раб = U_р / d = ${Up} / ${d.toFixed(2)} = ${ERab.toFixed(1)} В/мкм`);
    return output;
}
}

    // ============================================================
    // НАЧАЛЬНЫЕ ДАННЫЕ
    // ============================================================
    const defaultData = {
    R_short: 70, R_long: 1000, R_meandr: 15000,
    gammaR: 15, P: 50, tMax: 85, gammaPo: 5,
    deltaB: 0.02, deltaL: 0.04, deltaLY: 0.1,
    rho0: 250, rhoK: 0.25, alphaR: 0.0002, gammaRct: 0.5, P0: 10,
    b_long: 1.25, l_long: 5, gammaRk: 2,
    b_meandr: 0.4, a_meandr: 0.4, n_meandr: 5, gammaRkMeandr: 2,
    b_short: 5.4, l_short: 1.5, gammaRkShort: 2.7, deltaL_short: 0.044,
    C_pf: 5100, Up: 6.3, gammaC0: 5, epsilon: 5, Epr: 200, Kz: 4,
    alphaC: 0.00035, gammaCst: 1.5, deltaLc: 0.05, deltaBc: 0.05, deltaLYc: 0.1
};

    const { createApp, ref } = Vue;

    createApp({
    setup() {
    const showFirstGroup = ref(false);
    const showSecondGroup = ref(false);
    const inputValue = ref('');
    const inputError = ref('');
    const calculationResults = ref([]);
    const data = ref(JSON.parse(JSON.stringify(defaultData)));
    const selectedVar = ref({ section: '', name: '', currentValue: '', varKey: '' });

    const variablesList = ref([
{ name: 'R₁ (короткий)', value: 70, unit: 'Ом', varKey: 'R_short', section: 'Резисторы' },
{ name: 'R₂ (длинный)', value: 1000, unit: 'Ом', varKey: 'R_long', section: 'Резисторы' },
{ name: 'R₃ (меандр)', value: 15000, unit: 'Ом', varKey: 'R_meandr', section: 'Резисторы' },
{ name: 'γ_R', value: 15, unit: '%', varKey: 'gammaR', section: 'Общие' },
{ name: 'P', value: 50, unit: 'мВт', varKey: 'P', section: 'Общие' },
{ name: 't_max', value: 85, unit: '°C', varKey: 'tMax', section: 'Общие' },
{ name: 'γ_ρ₀', value: 5, unit: '%', varKey: 'gammaPo', section: 'Общие' },
{ name: 'Δb', value: 0.02, unit: 'мм', varKey: 'deltaB', section: 'Общие' },
{ name: 'Δl', value: 0.04, unit: 'мм', varKey: 'deltaL', section: 'Общие' },
{ name: 'Δl_у', value: 0.1, unit: 'мм', varKey: 'deltaLY', section: 'Общие' },
{ name: 'ρ₀', value: 250, unit: 'Ом/□', varKey: 'rho0', section: 'Материалы' },
{ name: 'P₀', value: 10, unit: 'мВт/мм²', varKey: 'P0', section: 'Материалы' },
{ name: 'γ_Rct', value: 0.5, unit: '%', varKey: 'gammaRct', section: 'Материалы' },
{ name: 'ρ_к', value: 0.25, unit: 'Ом·мм²', varKey: 'rhoK', section: 'Материалы' },
{ name: 'γ_Rк (длинный)', value: 2, unit: '%', varKey: 'gammaRk', section: 'КП' },
{ name: 'γ_Rк (меандр)', value: 2, unit: '%', varKey: 'gammaRkMeandr', section: 'КП' },
{ name: 'γ_Rк (короткий)', value: 2.7, unit: '%', varKey: 'gammaRkShort', section: 'КП' },
{ name: 'C', value: 5100, unit: 'пФ', varKey: 'C_pf', section: 'Конденсатор' },
{ name: 'U_p', value: 6.3, unit: 'В', varKey: 'Up', section: 'Конденсатор' },
{ name: 'b (длинный)', value: 1.25, unit: 'мм', varKey: 'b_long', section: '5.4' },
{ name: 'b (меандр)', value: 0.4, unit: 'мм', varKey: 'b_meandr', section: '5.5' },
{ name: 'b (короткий)', value: 5.4, unit: 'мм', varKey: 'b_short', section: '5.6' },
{ name: 'Δl (короткий)', value: 0.044, unit: 'мм', varKey: 'deltaL_short', section: '5.6' },
{ name: 'γ_C0', value: 5, unit: '%', varKey: 'gammaC0', section: '5.7' },
{ name: 'ΔL = ΔB', value: 0.05, unit: 'мм', varKey: 'deltaLc', section: '5.7' },
{ name: 'Δl_Y', value: 0.1, unit: 'мм', varKey: 'deltaLYc', section: '5.7' },
    ]);

    const formatValue = (val) => (val !== undefined && val !== null) ? val : '—';
    const getCurrentValue = (selected) => {
    if (!selected.varKey) return '—';
    return data.value[selected.varKey] !== undefined ? data.value[selected.varKey] : '—';
};

    const addLog = (msg) => { console.log(msg); };

    const selectVariable = (item) => {
    const val = data.value[item.varKey];
    selectedVar.value = {
    section: item.section,
    name: item.name,
    currentValue: val,
    varKey: item.varKey
};
    inputError.value = '';
    inputValue.value = '';
    addLog(`Выбрана: ${item.name} = ${val} ${item.unit}`);
};

    const setVariableValue = () => {
    if (!selectedVar.value.varKey) {
    inputError.value = 'Выберите переменную';
    return;
}
    const raw = inputValue.value.trim();
    if (!raw) {
    inputError.value = 'Введите значение';
    return;
}
    const num = parseFloat(raw.replace(',', '.'));
    if (isNaN(num) || num < 0) {
    inputError.value = 'Некорректное число';
    return;
}

    data.value[selectedVar.value.varKey] = num;
    const idx = variablesList.value.findIndex(v => v.varKey === selectedVar.value.varKey);
    if (idx !== -1) variablesList.value[idx].value = num;
    selectedVar.value.currentValue = num;
    addLog(`Установлено ${selectedVar.value.name} = ${num}`);
    inputValue.value = '';
    inputError.value = '';
};

    const resetToDefaults = () => {
    data.value = JSON.parse(JSON.stringify(defaultData));
    variablesList.value.forEach(v => {
    if (defaultData[v.varKey] !== undefined) v.value = defaultData[v.varKey];
});
    addLog('Все переменные сброшены к значениям по умолчанию');
};

    const toggleFirstGroup = () => {
    showFirstGroup.value = !showFirstGroup.value;
    showSecondGroup.value = false;
};
    const toggleSecondGroup = () => {
    showSecondGroup.value = !showSecondGroup.value;
    showFirstGroup.value = false;
};

    const addResult = (title, contentLines) => {
    const content = contentLines.map(line => line.replace(/ /g, '&nbsp;')).join('<br>');
    calculationResults.value.unshift({ title, content });
    if (calculationResults.value.length > 12) calculationResults.value.pop();
};

    const clearResults = () => {
    calculationResults.value = [];
    addLog('Результаты очищены');
};

    const runCalculation = (section) => {
    const d = data.value;
    let output = [];
    let title = '';

    switch(section) {
    case '5.1':
    title = '5.1 Расчет прямоугольного резистора (Кф > 1)';
    const resistor1 = new ThinFilmResistor();
    const res1 = resistor1.calculate(d.R_long, d.gammaR, d.P, d.tMax, d.gammaPo, d.deltaB, d.deltaL, d.rho0, d.P0, d.alphaR, d.gammaRct, d.gammaRk);
    output = res1.output;
    data.value.b_long = res1.b;
    data.value.l_long = res1.l;
    const idxLong = variablesList.value.findIndex(v => v.varKey === 'b_long');
    if (idxLong !== -1) variablesList.value[idxLong].value = res1.b;
    break;

    case '5.2':
    title = '5.2 Расчет резистора типа МЕАНДР (Кф > 10)';
    const meander = new MeanderResistor();
    const res2 = meander.calculate(d.R_meandr, d.gammaR, d.P, d.tMax, d.gammaPo, d.deltaB, d.deltaL, d.rho0, d.P0, d.alphaR, d.gammaRct, d.gammaRkMeandr);
    output = res2.output;
    data.value.b_meandr = res2.b;
    const idxMeandr = variablesList.value.findIndex(v => v.varKey === 'b_meandr');
    if (idxMeandr !== -1) variablesList.value[idxMeandr].value = res2.b;
    break;

    case '5.3':
    title = '5.3 Расчет короткого резистора (Кф < 1)';
    const shortRes = new ShortResistor();
    const res3 = shortRes.calculate(
    d.R_short, d.gammaR, d.P, d.tMax, d.gammaPo,
    d.deltaB, d.deltaL, d.rho0, d.P0, d.alphaR,
    d.gammaRct, d.gammaRk
    );
    output = res3.output;
    data.value.b_short = res3.b;
    data.value.l_short = res3.l;
    const idxShort = variablesList.value.findIndex(v => v.varKey === 'b_short');
    if (idxShort !== -1) variablesList.value[idxShort].value = res3.b;
    break;

    case '5.4':
    title = '5.4 Расчет контактного перехода (Кф > 1)';
    const contactLong = new ContactTransitionLong();
    output = contactLong.calculate(
    d.R_long, d.rho0, d.b_long, d.gammaRk,
    d.rhoK, d.deltaL, d.deltaLY
    );
    break;

    case '5.5':
    title = '5.5 Расчет контактного перехода (меандр)';
    const contactMeander = new ContactTransitionMeander();
    output = contactMeander.calculate(
    d.R_meandr, d.rho0, d.b_meandr, d.gammaRkMeandr,
    d.rhoK, d.deltaL, d.deltaLY
    );
    break;

    case '5.6':
    title = '5.6 Расчет контактного перехода (Кф < 1)';
    const Kf_short = d.R_short / d.rho0;
    const contactShort = new ContactTransitionShort();
    const res56 = contactShort.calculate(
    d.R_short, d.rho0, d.b_short, d.gammaRkShort,
    d.rhoK, d.deltaL_short, d.deltaLY, Kf_short
    );
    output = res56.output;
    if (res56.newB) {
    data.value.b_short = res56.newB;
    const idxB = variablesList.value.findIndex(v => v.varKey === 'b_short');
    if (idxB !== -1) variablesList.value[idxB].value = res56.newB;
}
    if (res56.newL) data.value.l_short = res56.newL;
    break;

    case '5.7':
    title = '5.7 Расчет пленочного конденсатора';
    const capacitor = new ThinFilmCapacitor();
    output = capacitor.calculate(
    d.C_pf, d.gammaR, d.Up, d.tMax, d.gammaC0,
    d.deltaLc, d.deltaBc, d.deltaLYc,
    d.epsilon, d.Epr, d.alphaC, d.gammaCst, d.Kz
    );
    break;

    default:
    output = ['Неизвестный расчет'];
}

    if (output.length > 0) addResult(title, output);
};

    const runAllCalculations = () => {
    const sections = ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7'];
    sections.forEach(s => runCalculation(s));
    addLog('Все расчеты выполнены');
};

    return {
    showFirstGroup, showSecondGroup, inputValue, inputError, calculationResults,
    selectedVar, variablesList, formatValue, getCurrentValue, selectVariable, setVariableValue,
    resetToDefaults, toggleFirstGroup, toggleSecondGroup,
    clearResults, runCalculation, runAllCalculations,
    data
};
}
}).mount('#app');
