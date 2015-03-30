'use strict';

angular.module('myApp.view1', ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
                $routeProvider.when('/view1', {
                    templateUrl: 'view1/view1.html',
                    controller: 'View1Ctrl'
                });
            }])
        .controller('View1Ctrl', ['$scope', function($scope) {
                $scope.cards = [];
                $scope.setupCards = {};
                $scope.resources = {};
                $scope.cardTypes = {};
                $scope.effects = {};

                function init() {
                    var r = $scope.resources;
                    r.whea = createResource("blé", "wheat");
                    r.ston = createResource("ardoise", "stone");
                    r.gold = createResource("or", "gold");
                    r.wool = createResource("laine", "wool");
                    r.weap = createResource("fer", "iron");

                    var ct = $scope.cardTypes;
                    ct.pay = createCardType("paysan", "green");
                    ct.cle = createCardType("clergé", "purple");
                    ct.bou = createCardType("bourgeois", "gold");
                    ct.kni = createCardType("chevalier", "blue");
                    ct.nob = createCardType("noble", "red");

                    var e = $scope.effects;
                    e.none = createEffect("<none>", "noeffect");
                    e.addMeeple1 = createEffect("+<meeple>");
                    e.addMeeple2 = createEffect("+<meeple><meeple>");

                    e.stealNear1 = createEffect("<player><arrow-left><meeple>", "stealNear1");
                    e.stealNear2 = createEffect("<meeple><arrow><player>", "stealNear2");
                    e.stealRich1 = createEffect("<meeple><arrow>+<meeple>", "stealRich1");
                    e.stealRich2 = createEffect("<meeple><meeple><arrow>+<meeple>", "stealRich2");
                    e.refundTrade1 = createEffect("+<meeple> après un échange", "refundTrade1");
                    e.skipTrade1 = createEffect("-<meeple> lors d'un échange", "skipTrade1");
                    e.pp_pay = createEffect("<score> /<ribbon>", "pp");
                    e.pp_cle = createEffect("<score> /<ribbon>", "pp");
                    e.pp_bou = createEffect("<score> /<ribbon>", "pp");
                    e.pp_kni = createEffect("<score> /<ribbon>", "pp");
                    e.pp_nob = createEffect("<score> /<ribbon>", "pp");
                    e.pointPer3meeple = createEffect("<score> / 3<meeple>", "sm");

                    e.s_pParC = createEffect("<score> /<ribbon>", "s_pParC");
                    e.s_pSansC = createEffect("-<score> sans <ribbon>", "s_pSansC");
                    e.s_pPlusC = createEffect("3 <score> si max <ribbon>", "s_pPlusC");
                    e.s_pSiC = createEffect("2 <score> si <ribbon>", "s_pSiC");
                    e.s_pPiece = createEffect("<score> / 3 <meeple>", "s_pPiece");
                    e.s_pCarteDiff = createEffect("<score> / ≠<ribbon-gray>", "s_pCarteDiff");

                    initSetupCards(ct, e);
                    initCards(r, ct, e);
                }

                function initCards(r, ct, e) {
                    initCardsBase(e, r.whea, ct.pay, e.pp_kni, ct.kni, ct.cle);
                    createPlayCard(r.whea, ct.bou, "champs", 2, 1, e.addMeeple1);
                    createPlayCard(r.whea, ct.nob, "ferme", 3, 1, e.addMeeple2);

                    initCardsBase(e, r.wool, ct.cle, e.pp_nob, ct.nob, ct.bou);
                    createPlayCard(r.wool, ct.kni, "Eglise", 2, 1, e.stealRich1);
                    createPlayCard(r.wool, ct.pay, "catédrale", 3, 1, e.stealRich2);

                    initCardsBase(e, r.gold, ct.bou, e.pp_pay, ct.pay, ct.kni);
                    createPlayCard(r.gold, ct.nob, "caravane", 2, 1, e.skipTrade1);
                    createPlayCard(r.gold, ct.cle, "caravane", 3, 1, e.skipTrade1);

                    initCardsBase(e, r.weap, ct.kni, e.pp_cle, ct.cle, ct.nob);
                    createPlayCard(r.weap, ct.pay, "brigands", 2, 1, e.stealNear1);
                    createPlayCard(r.weap, ct.bou, "brigands", 3, 1, e.stealNear2);

                    initCardsBase(e, r.ston, ct.nob, e.pp_bou, ct.bou, ct.pay);
                    createPlayCard(r.ston, ct.cle, "marché", 2, 1, e.refundTrade1);
                    createPlayCard(r.ston, ct.kni, "marché", 3, 1, e.refundTrade1);
                }

                function initCardsBase(e, resource, type, pointEffect, pointType, cointType) {
                    createPlayCard(resource, type, "maison", 0, 0, e.addMeeple1);
                    createPlayCard(resource, type, "maison", 0, 0, e.addMeeple1);
                    createPlayCard(resource, type, "moulin", 1, 1, e.none);
                    createPlayCard(resource, type, "place", 2, 2, e.none);
                    createPlayCard(resource, cointType, "chateau", 3, 0, e.pointPer3meeple);
                    createPlayCard(resource, pointType, "guilde", 3, 0, pointEffect);
                }

                function initSetupCards(ct, e) {
                    $scope.setupCards.pay = [createSetupCard(ct.pay, "Paysans", e.s_pPlusC)];
                    $scope.setupCards.cle = [createSetupCard(ct.cle, "Prêtres", e.s_pPlusC)];
                    $scope.setupCards.bou = [createSetupCard(ct.bou, "Bourgeois", e.s_pPlusC)];
                    $scope.setupCards.kni = [createSetupCard(ct.kni, "Chevaliers", e.s_pPlusC)];
                    $scope.setupCards.nob = [createSetupCard(ct.nob, "Nobles", e.s_pPlusC)];

                    $scope.setupCards.pay.push(createSetupCard(ct.pay, "Paysans", e.s_pParC));
                    $scope.setupCards.bou.push(createSetupCard(ct.bou, "Bourgeois", e.s_pParC));

                    $scope.setupCards.pay.push(createSetupCard(ct.pay, "Paysans", e.s_pSansC));
                    $scope.setupCards.cle.push(createSetupCard(ct.cle, "Prêtres", e.s_pSansC));

                    $scope.setupCards.bou.push(createSetupCard(ct.bou, "Bourgeois", e.s_pPiece));
                    $scope.setupCards.nob.push(createSetupCard(ct.nob, "Nobles", e.s_pPiece));

                    $scope.setupCards.cle.push(createSetupCard(ct.cle, "Prêtres", e.s_pSiC));
                    $scope.setupCards.kni.push(createSetupCard(ct.kni, "Chevaliers", e.s_pSiC));

                    $scope.setupCards.kni.push(createSetupCard(ct.kni, "Chevaliers", e.s_pCarteDiff));
                    $scope.setupCards.nob.push(createSetupCard(ct.nob, "Nobles", e.s_pCarteDiff));

                    $scope.setupCards.all = $scope.setupCards.pay
                            .concat($scope.setupCards.cle)
                            .concat($scope.setupCards.bou)
                            .concat($scope.setupCards.kni)
                            .concat($scope.setupCards.nob);

                }

                function createResource(name, img) {
                    return {
                        name: name,
                        img: img
                    }
                }

                function createCardType(name, color) {
                    return {
                        name: name,
                        color: color
                    }
                }

                function createEffect(name, img) {
                    return {
                        name: name,
                        img: img
                    }
                }

                function createPlayCard(resource, type, name, meeple, score, effect) {
                    $scope.cards.push({
                        resource: resource,
                        name: name,
                        type: type,
                        meeple: meeple,
                        score: score,
                        effect: effect
                    });
                }

                function createSetupCard(type, name, effect) {
                    return {
                        name: name,
                        type: type,
                        effect: effect
                    };
                }

                init();

            }])
        .directive('effect', function() {

            return {
                restrict: 'A',
                scope: {
                    effect: '='
                },
                link: function(scope, element, attrs) {
                    var e = scope.effect.effect.name;
                    var color = scope.effect.type.color;
                    e = e.replace(/<meeple>/g, '<span class="resource-meeple"></span>')
                    e = e.replace(/<score>/g, '<span class="resource-score"></span>')
                    e = e.replace(/<ribbon>/g, '<span class="resource-ribbon resource-ribbon-' + color + '"></span>')
                    e = e.replace(/<ribbon-(\w+)>/g, '<span class="resource-ribbon resource-ribbon-$1"></span>')
                    e = e.replace(/<player>/g, '<span class="resource-player"></span>')
                    e = e.replace(/<arrow>/g, '<span class="resource-arrow"></span>')
                    e = e.replace(/<arrow-left>/g, '<span class="resource-arrow-left"></span>')
                    e = e.replace(/<none>/g, '<span class="resource-none"></span>')
                    return element.html(e);
                }}
        });
